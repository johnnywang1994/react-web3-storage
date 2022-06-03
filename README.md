# React Web3 Storage

This is a practice demo for using web3-storage client javascript API


## Install

1. Install
```bash
$ yarn install
```

2. Build for preview
```bash
$ yarn build
```

3. Preview in Local Port
```bash
$ yarn preview
```

4. Expose Local Port to Https Env
> Since `Magic Login` needs a https env
```bash
$ ngrok http 8080
```


## Tech
Used library as following:
- Web3 Storage Client API
- React
- React Ant Design
- Ahooks
- Styled-Components
- Constate
- Magic Login


## Usage

### 1. Enter Your API Token/Sign In with email
Enter your API Token/Sign In to let application handle api feature for you. Dont worry, since the token would just used in the runtime and temp in `SessionStorage` which will be clear once close the browser tab, no database used to store your api token.

If you don't have an API TOKEN, you can generate one as [Guideing](https://web3.storage/docs/how-tos/generate-api-token/)

| Usage Type | List | Upload | Retrieve | Delete |
| -- | -- | -- | -- | -- |
| API Token | V | V | V | X |
| Sign In with email | V | V | V | V |

### 2. Dashboard
You can view all your uploaded files here with a `refresh` button, or you can also delete a file in `web3.storage`, the `Delete Selected` will call `web3.storage` official API with `Magic Login` confirmed which is the same process flow when you using Web UI. Since the official API may changed anytime they want, please don't rely on this tool for any production usage.

> Note!! Although we can delete the file from `web3.storage` via the official Http API. The file itself will still remain on other nodes. Be very careful before uploading anything to `web3.storage`, especially for those highly private personal data.

### 3. Upload
You can upload files wrapped with directory or not. After uploading, you will get a cid from web3.storage. And it may take about 1-3 minutes for dashboard to get the latest files.

### 4. Retrieve
You can search a file or directory with `cid` here