import "../../css/Home.css";
import { useWallets } from "@mysten/dapp-kit";

const Home = () => {
  useWallets
  return (
    <div className={"home-container"}>
      <div className="yellow-button">
          <div>
              Connect Wallet
          </div>
      </div>
    </div>
  );
}

export default Home;