import "../../css/Home.css";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Home = () => {
  let account = useCurrentAccount();
  return (
    <div className={"home-container"}>
        <div >
                {account ? <div className="guest-login"></div> : <div>Connect Wallet</div>}
        </div>
    </div>
  );
};

export default Home;