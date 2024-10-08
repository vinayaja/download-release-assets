import {expect, jest, it, describe, beforeEach,afterEach} from '@jest/globals'

import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github"; 
import { run } from "../index";

jest.mock("@actions/core");
jest.mock("@actions/github");

const mockedGetInput = getInput as jest.MockedFunction<typeof getInput>;
const mockedSetFailed = setFailed as jest.MockedFunction<typeof setFailed>;
const mockedGetOctokit = getOctokit as jest.MockedFunction<typeof getOctokit>;

describe("run", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getReleaseByTag with correct parameters", async () => {
    mockedGetInput.mockReturnValueOnce("fake-token")
                  .mockReturnValueOnce("v1.0.0")
                  .mockReturnValueOnce("asset1,asset2")
                  .mockReturnValueOnce("/fake/path")
                  .mockReturnValueOnce("owner/repo");

    const octokitMock = {
      rest: {
        repos: {
          getReleaseByTag: jest.fn(async () => ({ data: { id: 123 } })),
          listReleaseAssets: jest.fn(async () => ({ data: [{ id: 1, name: "asset1" }, { id: 2, name: "asset2" }] })),
          getReleaseAsset: jest.fn(async () => ({ data: { id: 1, name: "asset1", browser_download_url: "http://fakeurl" } }))
        }
      }
    };

    mockedGetOctokit.mockReturnValue(octokitMock as any);

    await run();

    expect(octokitMock.rest.repos.getReleaseByTag).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      tag: "v1.0.0",
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    expect(octokitMock.rest.repos.listReleaseAssets).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      release_id: 123,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    expect(octokitMock.rest.repos.getReleaseAsset).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      release_id: 123,
      asset_id: 1,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  });

  it("should call setFailed if an error occurs", async () => {
    mockedGetInput.mockReturnValueOnce("fake-token")
                  .mockReturnValueOnce("v1.0.0")
                  .mockReturnValueOnce("asset1,asset2")
                  .mockReturnValueOnce("/fake/path")
                  .mockReturnValueOnce("owner/repo");

    const octokitMock = {
      rest: {
        repos: {
          getReleaseByTag: jest.fn(async () => { throw new Error("Fake error"); })
        }
      }
    };

    mockedGetOctokit.mockReturnValue(octokitMock as any);

    await run();

    expect(mockedSetFailed).toHaveBeenCalledWith("Fake error");
  });
});
