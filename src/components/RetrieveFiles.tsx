import styled from 'styled-components'
import { Table, Input, Button, Skeleton, message } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useStoreContext } from '@/store'
import { makeStorageClient } from '@/web3-storage'
import { formatBytes, getIpfsLink } from '@/utils'

interface DataType {
  name: string;
  cid: string;
  size: string;
  key: string;
}

const columns: ColumnsType<DataType> = [
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
    key: 'cid',
    responsive: ['md']
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size'
  }
]

const StyledRetrieveFiles = styled.div`
  text-align: left;
`

const StyledButton = styled(Button)`
  margin: 12px auto;
`

function RetrieveFiles() {
  const { token } = useStoreContext()
  const [retrieveCid, setRetrieveCid] = useState('')
  const [retrieveFiles, setRetrieveFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const tableData = useMemo(
    () => retrieveFiles.map((file) => ({
      name: file.name,
      cid: file.cid,
      size: formatBytes(file.size),
      key: file.cid
    })
  ), [JSON.stringify(retrieveFiles)])

  // upload
  const handleRetrieveFiles = async () => {
    const client = makeStorageClient(token)
    if (retrieveCid) {
      setLoading(() => true)
      try {
        const res = await client.get(retrieveCid)
        if (res) {
          const files = await res.files()
          setRetrieveFiles(files)
          setLoading(() => false)
          message.success('Retrieve cid successful')
          console.log(files)
        }
      } catch(err) {
        setLoading(() => false)
        message.error('Failed to retrieve cid')
        throw err
      }
    }
  }

  return (
    <StyledRetrieveFiles>
      <div>
        <label>Target CID</label>
        <Input
          value={retrieveCid}
          onChange={(e) => setRetrieveCid(e.target.value)}
        />
      </div>
      <div>
        <StyledButton
          type="primary"
          disabled={!retrieveCid}
          onClick={() => handleRetrieveFiles()}
        >
          Retrieve Files
        </StyledButton>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} />
      )}
    </StyledRetrieveFiles>
  )
}

export default RetrieveFiles
