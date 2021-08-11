import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import AnsiImageRender from "./AnsiImageRender"
import { StoreFileOnIPFS } from "../helpers";

//import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import { NFTStorage, File } from 'nft.storage';

const nftStorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzYjgwMzQ4MzY1MWE4MDE5MjU5NzQ2MjY5ZjM1ZDI4NUMzMEJlQjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODE1NzYxNTc3NCwibmFtZSI6ImtleTEifQ.G9BNydhDBxYJqYr06xSW-hRbkj5AptqaijFokHPx3h0';
const nftsClient = new NFTStorage({ token: nftStorageApiKey })

async function nftsTestStoreString(s) {
  const metadata = await nftsClient.store({
    name: 'nft.storage store test',
    description: 'Description: ' + s,
    image: new File(['<DATA>'], 'notansi.jpg', { type: 'image/jpg' }),
    //image: new Blob('XXX'),
    properties: {
      custom: 'Custom data can appear here, files are auto uploaded.',
      //file: new File(['<DATA>'], 'README.md', { type: 'text/plain' }),
      file: new File([new Blob(['this is a blob', 'by tomo'])], 'README.md', { type: 'text/plain' }),
    }
  })

  console.log('IPFS URL for the metadata:', metadata.url)
  console.log('metadata.json contents:\n', metadata.data)
  console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
}


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useModalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function MakeBlockModal() {

  const classes = useModalStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [selectedFileState, setSelectedFileState ] = React.useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  var file;
  var fileObjectUrl;
  const processFile = (f) => {
    console.log('file selected', f);
    file = f;
    const reader = new FileReader();
    fileObjectUrl = window.URL.createObjectURL(f);
    let userMessage = 'File selected'
    setSelectedFileState({file, fileObjectUrl, userMessage});
  }

  const uploadFileAndProceed = async () => {
    let userMessage = 'File is being uploaded to IPFS...';
    setSelectedFileState({...selectedFileState, userMessage})
    let metadata = await StoreFileOnIPFS('name', 'description', undefined, selectedFileState.file);
    userMessage = 'File upload complete. Proceed to submit transaction.'
    setSelectedFileState({...selectedFileState, metadata, userMessage});
  }

  

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Mint New Block!</h2>
      <p id="simple-modal-description">

        You will get the next available block. 
      </p><p>
        Current expected position:

      </p><p>
        Col: 0,
      </p><p>
        Row: 0
      </p>
      <button>MINT NEXT AVAILABLE BLOCK</button>
      <p>
        Current contents:
        
        <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={"tna1.ans"} />
      </p><p>
        Choose .ans file to save into your chosen block:
        <input type="file" id="input" onChange={(evt) => processFile(evt.target.files[0]) } />
      </p><p>
        { fileObjectUrl }
        { selectedFileState.fileObjectUrl && 
        <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270, height: 270, overflow: 'scroll' }} tokenURI={selectedFileState.fileObjectUrl} /> }
      </p><p>
      { selectedFileState.file && <button onClick={() => uploadFileAndProceed()}>Proceed</button> }
        <p>{selectedFileState.userMessage}</p>
      </p>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Manage Blocks / Mint &amp; Write / CLICK ME TO OPEN DIALOG
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

// copied from ansi
const useStyles = makeStyles((theme) => ({
    root: {
          flexGrow: 1,
        },
    paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
}));

function RecentlySavedBlocks({limit}) {
  const [newFilterAddress, setNewFilterAddress] = useState();
  const classes = useStyles();
  let ansiFileNames = [
    'tna1.ans',
    'tna2.ans',
    'tna3.ans',
    'tna4.ans',
    /*
    'Shion%20in%20Monster%20World.ans',
    'TestPattern%20ANSI.ans',
    'Tetris.ans',
    */
  ];
  //let ansiUriArr = ansiFileNames.map(a => ({name: a, path: 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/' + a}));
  let ansiUriArr = ansiFileNames.map(a => ({name: a, path: '/' + a}));
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', paddingBottom: 20, width: '100%', color: 'white' /* XXX bug because color should be white by ansi code */  }} tokenURI={'/ansi-bbs1.ans'} />
        </Grid>
        <Grid item xs={3}>
          <AnsiImageRender style={{fontSize: 8, lineHeight: '8px', color: 'white' }} tokenURI={'/connect-metamask.ans'} />
          <button>Connect Metamask</button>
          <div><span>Connected address: 0x1234...5678</span></div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={8} style={{backgroundColor:"black"}}>
          <AnsiImageRender style={{fontSize: 18, lineHeight: '18px', paddingLeft: 30, height: 650, width: 800, color: 'white' /* XXX bug because color should be white by ansi code */  }} tokenURI={'/info.ans'} />
        </Grid>
        <Grid item xs={3}>
          <div><span>Last known minted block at index 679.</span></div>
          <div><span>Mint cost for next block: 0.00125 MATIC</span></div>
          <MakeBlockModal />
        </Grid>
        <div style={{border: '1px solid black'}}>
          <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', textAlign: 'left', fontWeight: 800}} className='foobar'>Recently Saved Blocks ({limit})</h2>
          <Input
            onChange={e => {
              setNewFilterAddress(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => { console.log('TODO filter by address') }}
          >Filter Blocks by Address
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => { console.log('TODO filter by address') }}
          >Filter Blocks by My Address
          </Button>
          <Grid container spacing={3,0} >

            {'tna1.ans|tna2.ans|tnb1.ans|tnb2.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
          </Grid><Grid container spacing={3,0} >
            {'tna3.ans|tna4.ans|tnb3.ans|tnb4.ans'.split('|').map((uri, i) => (
                    <div key={"ansi1-" + i} className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', width: 270 }} tokenURI={uri} />
                    </div>
            ))}
            {ansiUriArr.map((uri, i) => (
                <Grid key={"ansi2-" + i} item xs style={{backgroundColor:"black"}}>
                  <Paper className={classes.paper}>
                    <div className="ansi-wrapper" style={{maxWidth: 400}}>
                      <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', height: 240, width: 320 }} tokenURI={uri.path} />
                    </div>
                    <h3>FILE: {uri.name}</h3>
                    <ul><li>Row: 66</li><li>Col: 6</li><li>Owner: 0x92928...13812313</li></ul>
                  </Paper>
                </Grid>
            ))}

          </Grid>
        </div>
      </Grid>
    </div>
  )
}
function AutoGrid() {
  return '';
  const classes = useStyles();
  const classBreadcrumbListItem = {
              display: 'inline-block',
              marginBottom: 0,
              marginRight: 0,
              fontSize: '1.25rem',
              fontWeight: 400,
    };
  const stylesBreadcrumbList = { padding: 0, margin: 0, textAlign: 'left' };

  let ansis = [ 'crop-MAX_MOUSE-HYPERNODEC-0.png', 'crop-MAX_MOUSE-HYPERNODEC-4.png', 'crop-ZII-TNA-0.png', 'crop-ZII-TNA-1.png', 'crop-ZII-TNA-7.png', 'crop-arl-xdiff-2.png' ];
  ansis = [ 'crop16-MAX_MOUSE-HYPERNODEC-17.png', 'crop16-MAX_MOUSE-HYPERNODEC-33.png', 'crop16-arl-xdiff-20.png', 'crop16-arl-xdiff-4.png', 'crop16-arl-xdiff-8.png', 
    'crop16-illusion-5.png', 
    'crop16-illusion-9.png', 
    'crop16-illusion-13.png', 
  ];
  // https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/Super%20Mario%20castle%20(wide)%20(256%20colors).ans
  let ansiFileNames = ['256%20colors%20swatches%20(UTF-8).txt',
    '256%20colors%20swatches.ans',
    'Apple%20II%20(80x25).ans',
    'Apple%20II.ans',
    'Apple%20Macintosh.ans',
    'Arecibo%20message.ans',
    'Arkanoid.ans',
    'Breakout.ans',
    'CatChum%20(ASCII).txt',
    'CatChum.ans',
    'Commodore%2064%20(80x25).ans',
    'Commodore%2064.ans',
    'Frogger%20(small).ans',
    'GW-Basic%20(UTF-8).txt',
    'Gold%20medal.ans',
    'IBM%20PC%20(80x25).ans',
    'IBM%20PC%20startup%20screen%20(80x25).ans',
    'IBM%20PC.ans',
    'IBM%20PCjr%20startup%20screen%20(40x25).ans',
    'IBM%20PCjr%20startup%20screen%20(80x25%20UTF-8%20double-width%20text).txt',
    'IBM%20PCjr%20startup%20screen%20(80x25).ans',
    'Lode%20Runner.ans',
    'Lxss%20banner.ans',
    'Lxss-VTArt-Blue.txt',
    'Lxss-VTArt-Red.txt',
    'MITS%20Altair%208800.ans',
    'Mario%20Bros.%20(small).ans',
    'Mario%20Bros.%20(wide).ans',
    'MiniColorsWheel.ans',
    'Monopoly%20board.ans',
    'Morse%20Code.ans',
    'Pac-Man%20(80x25).ans',
    'Pac-Man%20(UTF-8).txt',
    'Pac-Man.ans',
    'Pitfall!.ans',
    'QBasic%20(UTF-8).txt',
    'Sega%20Snail%20Maze%20(UTF-8%20double-width%20text).txt',
    'Sega%20Snail%20Maze%20(UTF-8).txt',
    'Sega%20Snail%20Maze.ans',
    'Shion%20in%20Monster%20World.ans',
    'Sinclair%20ZX-Spectrum.ans',
    'Sonic%20Green%20Hill%20Zone%20(256%20colors).ans',
    'Sonic%20Green%20Hill%20Zone.ans',
    'Super%20Mario%20castle%20(narrow).ans',
    'Super%20Mario%20castle%20(wide)%20(256%20colors).ans',
    'Super%20Mario%20castle%20(wide).ans',
    'TestPattern%2024-bit.ans',
    'TestPattern%20ANSI.ans',
    'Tetris.ans',
    'USA%20flag.ans',
    'Visual%20Basic%20for%20DOS%20(UTF-8).txt',
    'WSL%20logo%20(UTF-8).txt',
    'Win10%20PowerToys.ans',
    'Win10%20wallpaper.ans',
    'Win10%20wallpaper.txt',
    'Windows%201%20(UTF-8).txt',
    'Windows%201.asc',
    'Windows%2010.asc',
    'Windows%20Terminal.ans'];
  // let ansiUriArr = ansiFileNames.map(a => 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/' + a);
  let ansiUriArr = ansiFileNames.map(a => ({name: a, path: 'https://raw.githubusercontent.com/PhMajerus/ANSI-art/master/' + a}));

  // XXX PUBLIC_URL not set, hard code as root
  // var obj = {counter: 1};
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <div style={{border: '1px solid black'}}>
          <h2 style={{fontFamily: '"Roboto", sans-serif', fontSize: '4em', textAlign: 'left', fontWeight: 800}} className='foobar'>ANSi Portfolio Blockception</h2>
          <div className="container"><div className="row"><div className="col-12">
            <ul id="breadcrumbs" className="breadcrumb-list" style={stylesBreadcrumbList}
          >
              <li className="breadcrumb-list-item" style={classBreadcrumbListItem}>Home</li>
              <li className="breadcrumb-list-item breadcrumb-sep" style={{...classBreadcrumbListItem, padding: '0.66667rem'}}>/</li>
              <li className="breadcrumb-list-item current" style={classBreadcrumbListItem} >Portfolio 3 Columns</li>
            </ul>
          </div></div></div>
          
          <img width="33%" src={"/" + ansis[2]} />
          <img width="33%" src={"/" + ansis[3]} />
          <img width="33%" src={"/" + ansis[5]} />
          <img width="33%" src={"/" + ansis[0]} />
          <img width="33%" src={"/" + ansis[4]} />
          <img width="33%" src={"/" + ansis[6]} />
          <img width="33%" src={"/" + ansis[1]} />
          <img width="33%" src={"/" + ansis[3]} />
          <img width="33%" src={"/" + ansis[7]} />
        </div>
      </Grid>
      <Grid container spacing={3} style={{border: '1px solid black', padding: 10}}>
        <Grid item xs={3}>
          <img width="100%" src={"/" + ansis[0]} />
          <Paper className={classes.paper}>
          xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <img width="100%" src={"/" + ansis[1]} />
          <Paper className={classes.paper}>xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <img width="100%" src={"/" + ansis[2]} />
          <Paper className={classes.paper}>xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>
        <Grid item xs>
          <img width="100%" src={"/" + ansis[3]} />
          <Paper className={classes.paper}>xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <img width="100%" src={"/" + ansis[4]} />
          <Paper className={classes.paper}>xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>
        <Grid item xs>
          <img width="100%" src={"/" + ansis[5]} />
          <Paper className={classes.paper}>xs
            <h3>FN-EXAM.ANS</h3>
            <ul><li>(66, 6)</li><li>0x9292813812313</li></ul>
          </Paper>
        </Grid>

        {/* {ansiUriArr.map(uri => (
          <Grid item xs>
              <AnsiImageRender tokenURI={uri.path} />
            <Paper className={classes.paper}>xs
              <h3>{uri.name.replaceAll('%20', ' ')}</h3>
            </Paper>

          </Grid>
        ))} */}
        
      </Grid>

      
      <Grid container spacing={3,0} >

        {ansiUriArr.map((uri, i) => (
            <Grid key={"autogrid-ansi-" + i} item xs style={{backgroundColor:"black"}}>
              <AnsiImageRender tokenURI={uri.path} />
            </Grid>
        ))}

      </Grid>
      
      
    </div>
  );
}


export default function ExampleUI({
  myBBlocksCount,
  my1stBBlockTokenId,
  my1stBBlockTokenURI,
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [newTokenURI, setNewTokenURI] = useState("loading...");

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, /*width: 400,*/ margin: "auto", marginTop: 64 }}>
        <h2>Bulletin Block System Permissionless Distributed UI:</h2>
        {/* <h4>purpose: {purpose}</h4> */}
        <Divider />
        <RecentlySavedBlocks limit={3} />
        <Divider />
        <div style={{ margin: 8 }}>
          <div>I own {myBBlocksCount ? myBBlocksCount.toString() : 0} bBlocks</div>
          <div>
            <h3>Here's your 1st (if &gt; 0) tokenId</h3>
            <div>{ my1stBBlockTokenId ? my1stBBlockTokenId.toString() : 'nada' }</div>
            <div>{ my1stBBlockTokenURI ? my1stBBlockTokenURI : 'nada' }</div>


          </div>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.mint(), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Mint!
          </Button>
          <Input
            onChange={e => {
              setNewTokenURI(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setTokenURI(my1stBBlockTokenId, newTokenURI), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Set your 1st tokenURI !
          </Button>
          <AutoGrid />
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              await nftsTestStoreString(newPurpose);
              if (false) {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
              }
            }}
          >
            Test nft.storage description [Set Purpose]!
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(writeContracts.YourContract.setPurpose("🍻 Cheers"));
            }}
          >
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
                  value: utils.parseEther("0.001"),
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
                data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
                  "🤓 Whoa so 1337!",
                ]),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Another Example
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} />
                {item[1]}
              </List.Item>
            );
          }}
        />
      </div>

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => { }} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => { }} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => { }} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
