# Download assets from release as artifacts

Simple GitHub Action to Download assets to release as artifacts.

See also [publish-release-assets](https://github.com/marketplace/actions/publish-release-assets).

## Inputs

- `gh-token` - Github Token or Pat Token (Required)
- `release-tag` - Release Tag (Required)
- `asset-names` - comma seperated value for asset names (Required)
- `path` - Destination path. Defaults to $GITHUB_WORKSPACE (Optional)
- `repository` - The repository owner and the repository name joined together by "/". (Optional)

## Example

If you want to fetch all secrets

```yml

- uses: vinayaja/publish-release-assets@1.1.0
  with:
    gh-token: ${{ github.token }}
    release-tag: 'v1.0.0'
    asset-names: 'assetname1.zip,assetname.txt'
    path: '${{ github.workspace }}\artifacts'
    repository: 'owner/repo'
```

