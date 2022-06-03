import styled from 'styled-components'
import { Table, Button, Skeleton, Modal, message } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useMount } from 'ahooks'
import { useStoreContext } from '@/store'
import { makeStorageClient, deleteById } from '@/web3-storage'
import Icon from '@/components/Icon'
import { formatBytes, getIpfsLink } from '@/utils'

// DELETE https://api.web3.storage/user/uploads/bafybeigsgtvvye4kiuw7q6pwp34oomgnehztthbratu2d5woh2zy3o6es4

// GET https://api.web3.storage/user/uploads?before=2022-06-02T15%3A03%3A06.511Z&size=1000

interface DataType {
  name: string;
  cid: string;
  size: string;
  key: string;
  created: string;
}

const { confirm, info } = Modal

const columns: ColumnsType<DataType> = [
  {
    title: 'Date',
    dataIndex: 'created',
    key: 'created'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, f: any) => (
      <a
        href={getIpfsLink(f.cid)}
        target="_blank"
        rel="noreferrer"
      >{text}</a>
    )
  },
  {
    title: 'Cid',
    dataIndex: 'cid',
    key: 'cid'
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size'
  }
]

const StyledListFiles = styled.div`
  text-align: left;
`

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  margin: 12px 8px;
`

function ListFiles() {
  const { token, magicToken, setHasToken } = useStoreContext()
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const tableData = useMemo(
    () => list.map((item) => ({
      name: item.name,
      cid: item.cid,
      size: formatBytes(item.dagSize),
      key: item.cid,
      created: new Date(item.created).toLocaleString()
    })
  ), [JSON.stringify(list)])

  const handleConfirmDeleteFailed = () => {
    info({
      title: 'Note',
      icon: <Icon style={{ color: 'orange' }}>carbon:warning-square</Icon>,
      content: 'API Token is currently not supported to delete files by official Web3.Storage Client API, please Sign In to delete files.'
    })
  }

  const handleDeleteFiles = async () => {
    // console.log('delete', selectedRowKeys)
    // need magic login to be Sign In with idToken in Authorization
    try {
      const promises = selectedRowKeys.map((key) => {
        const cid = key as string
        return deleteById(cid, magicToken)
      })
      await Promise.all(promises)
      setSelectedRowKeys(() => [])
      message.success('Delete files successful')
    } catch(err) {
      setSelectedRowKeys(() => [])
      message.error('Delete files failed')
      handleConfirmDeleteFailed()
      throw err
    }
  }

  const handleConfirmDelete = () => {
    confirm({
      title: 'Do you Want to delete these files?',
      icon: <Icon style={{ color: 'orange' }}>carbon:warning-square</Icon>,
      content: 'Deleted files may still remain accessible if others pinned the same file on their nodes.',
      onOk() {
        handleDeleteFiles()
      }
    })
  }

  const handleListFiles = async () => {
    setSelectedRowKeys(() => [])
    setLoading(() => true)
    try {
      const client = makeStorageClient(token)
      const fileList = []
      for await (const upload of client.list()) {
        fileList.push(upload)
      }

      // console.log(fileList)
      setList(fileList)
      setLoading(() => false)
      message.success('Fetch files successful')
    } catch(err) {
      setLoading(() => false)
      setHasToken(false)
      message.error('Token invalid')
      throw err
    }
  }

  useMount(() => {
    handleListFiles()
  })

  return (
    <StyledListFiles>
      <StyledButton
        type="primary"
        danger
        disabled={!selectedRowKeys.length}
        icon={<Icon>bi:trash</Icon>}
        onClick={() => handleConfirmDelete()}
      >
        Delete Selected
      </StyledButton>
      <StyledButton
        type="ghost"
        icon={<Icon>bx:refresh</Icon>}
        onClick={() => handleListFiles()}
      >
        Refresh
      </StyledButton>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          scroll={{ x: 800 }}
        />
      )}
    </StyledListFiles>
  )
}

export default ListFiles
