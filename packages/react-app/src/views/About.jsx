import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import AnsiImageRender from "./AnsiImageRender"

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

function RecentlySavedBlocks({limit}) {
  const [newFilterAddress, setNewFilterAddress] = useState();
}

export default function About({
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

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <AnsiImageRender style={{fontSize: 24, lineHeight: '24px', paddingBottom: 20, width: '100%', color: 'white' /* XXX bug because color should be white by ansi code */  }} tokenURI={'/ansi-bbs1.ans'} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={8} style={{backgroundColor:"black"}}>
            <AnsiImageRender style={{fontSize: 18, lineHeight: '18px', paddingLeft: 30, height: 650, width: 800, color: 'white' /* XXX bug because color should be white by ansi code */  }} tokenURI={'/info.ans'} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
