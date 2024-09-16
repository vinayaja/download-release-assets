import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 

export async function run() {
    const token = getInput("gh-token");
    const releaseTag = getInput("release-tag");
    const assetNames = getInput("asset-names");

    const octoKit = getOctokit(token);

    try{  
        const fs = require('fs');        
        const releaseId =  (await octoKit.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: releaseTag,
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            })).data.id;
        
        const allAssetNames = assetNames.split(',');
        
        let assetIds = ((await octoKit.rest.repos.listReleaseAssets({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: releaseId,
            headers: {
            'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data);

        for(var assetId of assetIds)
        {
            console.log(`Uploading asset ${assetId.id}`);

        };

    }   catch(error){
        setFailed((error as Error)?.message ?? "Unknown error");
    }
    
}

if(!process.env.JEST_WORKER_ID){
    run();
}