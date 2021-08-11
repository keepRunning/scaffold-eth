import { NFTStorage, File } from 'nft.storage';

const nftStorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzYjgwMzQ4MzY1MWE4MDE5MjU5NzQ2MjY5ZjM1ZDI4NUMzMEJlQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODE1NzYxNTc3NCwibmFtZSI6ImtleTEifQ.G9BNydhDBxYJqYr06xSW-hRbkj5AptqaijFokHPx3h0';
const nftsClient = new NFTStorage({ token: nftStorageApiKey })

export default async function StoreFileOnIPFS(name, description, imgFile, srcFile) {
    const reader = new FileReader();
    try {
        const metadata = await nftsClient.store({
            name,
            description,
            image: imgFile ?? new File(['<DATA>'], 'notansi.jpg', { type: 'image/jpg' }), // unable to upload non-image file. We could load ansi, capture image and then set it as this field.
            properties: {
                srcData: reader.readAsText(srcFile, 'ISO-8859-1'),
                srcFile: srcFile,
            }
        });

        console.log('IPFS URL for the metadata:', metadata.url)
        console.log('metadata.json contents:\n', metadata.data)
        console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed());
        return metadata;
    }
    catch (ex) {
        console.error(ex);
        return ex;
    }
}
