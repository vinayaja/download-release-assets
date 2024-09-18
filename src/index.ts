import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 

export async function run() {
    const token = getInput("gh-token");
    const releaseTag = getInput("release-tag");
    const assetNames = getInput("asset-names");

    const octoKit = getOctokit(token);

    try{         
        const releaseId =  (await octoKit.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: releaseTag,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.id;
        
        const allAssetNames = assetNames.split(',');
        
        let assetIds = (await octoKit.rest.repos.listReleaseAssets({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: releaseId,
            headers: {
            'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data;

        for(var assetId of assetIds)
        {
            let asset = (await octoKit.rest.repos.getReleaseAsset({
                owner: context.repo.owner,
                repo: context.repo.repo,
                release_id: releaseId,
                asset_id: assetId.id,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data;

            if(allAssetNames.includes(asset.name))
            {
                const fs = require('fs');
                const https = require('https');
                const headers = { 'accept':'application/octet-stream' };
                
                const request = https.get(asset.browser_download_url, { headers: headers }, (response:any) => {
                    const filePath = `${process.env.GITHUB_WORKSPACE}/${asset.name}`;
                    const fileStream = fs.createWriteStream(filePath);
                    response.pipe(fileStream);
                
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`Downloaded asset to ${filePath}`);
                    });
                });
                
                request.on('error', (err:any) => {
                    console.error(`Error: ${err.message}`);
                });
            }

        };

    }   catch(error){
        setFailed((error as Error)?.message ?? "Unknown error");
    }
    
}

if(!process.env.JEST_WORKER_ID){
    run();
}