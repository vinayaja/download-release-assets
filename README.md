# Upload assets to release as artifacts

Simple GitHub Action to Upload assets to release as artifacts  

## Inputs

- `gh-token` - Github Token or Pat Token (Required)
- `release-tag` - Release Tag (Required)
- `asset-names` - comma seperated value for asset names (Required)

## Example

If you want to fetch all secrets

```yml

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - uses: vinayaja/publish-release-assets@main
      with:
        gh-token: ${{ github.token }}
        release-tag: 'v1.0.0'
        asset-names: 'assetname1.zip,assetname.txt'
        
```

