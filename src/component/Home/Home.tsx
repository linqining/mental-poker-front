import "../../css/Home.css";
import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";

const Home = () => {
  let account = useCurrentAccount();
  return (
      <div className={"home-container"}>
          {/*<div>*/}
          {/*    {account ? <div>快速开始</div> : <div className="guest-login"></div>}*/}
          {/*</div>*/}
          <div>
              {account ? <div>快速开始</div> :
                  <ConnectButton
                      connectText=""
                      style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '10px 15px',
                          borderRadius: '5px',
                          border: 'none',
                          cursor: 'pointer'
                      }}
                      className="guest-login"
                  />
              }
          </div>

      </div>
  );
};

export default Home;