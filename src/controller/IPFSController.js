const { JWT } = require("../constants");
const axios = require("axios");
const FormData = require("form-data");
const { addNode, getPrevHash } = require("../model/Node");

const postToIPFS = async (body, filetype, filename) => {
  try {
    const formData = new FormData();
    formData.append("file", body, { filename: filetype });
    const pinataMetadata = JSON.stringify({
      name: filename,
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);
    const response = await axios.post(
      `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const data = await response.data;
    return data.IpfsHash;
  } catch (error) {}
};
const postToIPFSWithMetadata = async (body, filetype, metadata) => {
  try {
    const formData = new FormData();
    formData.append("file", body, { filename: filetype });
    const pinataMetadata = JSON.stringify(metadata);
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);
    const response = await axios.post(
      `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const data = await response.data;
    return data.IpfsHash;
  } catch (error) {}
};
const uploadPhotosToIPFS = async (photo, name, type) => {
  try {
    const formData = new FormData();

    formData.append("file", photo, { filename: `${name}${type}` });

    const pinataMetadata = JSON.stringify({
      name: `${name}${type}`,
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const data = await response.data;
    return data.IpfsHash;
  } catch (error) {}
};
const deleteFileFromIPFS = async (filename) => {
  try {
    let hash = await getHash(filename);
    const response = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${hash}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    return "Done";
  } catch (error) {}
};

const getAllFilesFromIPFS = async (type) => {
  try {
    const filesState = new Map();
    let numOfFiles = await checkFilesLength(type);
    if (numOfFiles === 0) {
      return [];
    }
    while (true) {
      let lastFileHash = await getHash(`${type}${numOfFiles}`);
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${lastFileHash}`,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );
      const data = await response.data;
      let currNode = data[0];
      addNode(filesState, currNode);
      if (getPrevHash(filesState, numOfFiles) === null) {
        return filesState;
      }
      numOfFiles--;
    }
  } catch (error) {}
};
const getAllPhotosFromIPFS = async (name) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${name}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const pinnedFiles = response.data.rows;
    return pinnedFiles;
  } catch (error) {}
};

const getFileByHash = async (hash) => {
  try {
    const fileState = new Map();
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const data = await response.data;
    let currNode = data[0];
    addNode(fileState, currNode);
    return fileState;
  } catch (error) {}
};
const getHash = async (filename) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${filename}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const pinnedFiles = response.data.rows;
    if (pinnedFiles.length > 0) {
      return pinnedFiles[0].ipfs_pin_hash;
    } else {
      return [];
    }
  } catch (error) {}
};
const getHashArray = async (filename) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${filename}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const pinnedFiles = response.data.rows;
    if (pinnedFiles.length > 0) {
      return pinnedFiles;
    } else {
      return [];
    }
  } catch (error) {}
};

const checkFilesLength = async (type) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${type}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const pinnedFiles = response.data.rows;
    return pinnedFiles.length;
  } catch (error) {}
};

const getOriginalFileByHash = async (type) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${type}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const pinnedFiles = response.data.rows;
    return pinnedFiles[0];
  } catch (error) {}
};

const checkFileVerification = async (type) => {
  try {
    const file = await getOriginalFileByHash(type);
    if (file.metadata.keyvalues === null) {
      return false;
    }
    return true;
  } catch (error) {}
};

module.exports = {
  postToIPFS,
  postToIPFSWithMetadata,
  getHash,
  checkFilesLength,
  getAllFilesFromIPFS,
  uploadPhotosToIPFS,
  getAllPhotosFromIPFS,
  checkFileVerification,
  getHashArray,
  getFileByHash,
  deleteFileFromIPFS,
};
