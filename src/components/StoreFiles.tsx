import styled from 'styled-components'
import { Upload, message, Button, Input, Checkbox } from 'antd'
import type { UploadProps } from 'antd'
import { useStoreContext } from '@/store'
import { makeStorageClient } from '@/web3-storage'
import Icon from '@/components/Icon'
import { getIpfsLink } from '@/utils'

const { Dragger } = Upload;

const StyledStoreFiles = styled.div`
  text-align: left;
  p {
    color: red;
    font-size: 12px;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin: 12px auto;
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  margin: 12px auto;
`

function StoreFiles() {
  const { token } = useStoreContext()
  const [fileName, setFileName] = useState('')
  const [wrapWithDirectory, setWrap] = useState(true)
  const [cid, setCid] = useState('')
  const [selectedFiles, setSelectedFile] = useState<any[]>([])

  // upload
  const handleUploadFiles = async () => {
    const client = makeStorageClient(token)
    if (selectedFiles) {
      try {
        const isoStr = (new Date()).toISOString()
        const cid = await client.put(selectedFiles as any[], {
          name: fileName || `Upload at ${isoStr}`,
          wrapWithDirectory
        })
        setCid(cid)
        setFileName('')
        message.success('Upload successful')
      } catch(err) {
        message.error('Upload failed')
        throw err
      }
    }
  }

  const handleChangeFiles = (file: File) => {
    setSelectedFile([...selectedFiles, file])
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      handleChangeFiles(file)
      // manual upload
      return false
    }
  }

  return (
    <StyledStoreFiles>
      {cid
        ? (
            <div>
              <a
                href={getIpfsLink(cid)}
                target="_blank"
                rel="noreferrer"
              >
                Your cid is: {cid}
              </a>
            </div>
          )
        : ''
      }
      <div>
        <label>Name (optional)</label>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <p>Default pattern "Upload at 2022-06-01T16:15:22.652Z"</p>
      </div>
      <div>
        <StyledCheckbox
          checked={wrapWithDirectory}
          onChange={(e) => setWrap(e.target.checked)}
        >
          Wrap with directory(
            <a
              href="https://web3.storage/docs/reference/js-client-library/#parameters"
              target="_blank"
            >
              See Document
            </a>
          )
        </StyledCheckbox>
      </div>
      <div>
        <Dragger {...props}>
          <StyledButton icon={<Icon>bx:upload</Icon>}>
            Click to Upload
          </StyledButton>
        </Dragger>
      </div>
      <div>
        <StyledButton
          type="primary"
          disabled={!selectedFiles.length}
          onClick={() => handleUploadFiles()}
        >
          Submit Files
        </StyledButton>
      </div>
    </StyledStoreFiles>
  )
}

export default StoreFiles