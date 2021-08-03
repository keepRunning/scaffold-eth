import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";

//import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

function AutoGrid() {
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
  // XXX PUBLIC_URL not set, hard code as root
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
        <h2>Example UI:</h2>
        <h4>purpose: {purpose}</h4>
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
            }}
          >
            Set Purpose!
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
