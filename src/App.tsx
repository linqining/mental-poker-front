import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import {useCurrentAccount, ConnectButton, useSuiClient, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {EventBus} from "./game/EventBus.ts";
import {Transaction} from "@mysten/sui/transactions";


function App() {
    const account = useCurrentAccount();
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {
        if(phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene)
            {
                scene.changeScene();
            }
        }
    }

    const moveSprite = () => {

        if(phaserRef.current) {

            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === 'MainMenu')
            {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {

                    setSpritePosition({ x, y });

                });
            }
        }

    }

    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            if (scene)
            {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, 'star');

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    }

    const actionLoginFunction = (scene_instance: Phaser.Scene) =>{
        console.log(scene_instance);
        connectBTNRef.current?.getElementsByTagName("button")[0].click();
        // connectBTNRef.current?.getElementsByTagName("button")[0].reset();
        // todo button click 后充值
    };
    const connectBTNRef = useRef<HTMLDivElement>(null);

    phaserRef.current?.scene?.data.set("current_account",account)

    const {mutate:signAndExecuteTransaction} = useSignAndExecuteTransaction();
    let client = useSuiClient();
    const [joinProcessing, setJoinProcessing] = useState(false);
    const PACKAGE = "0x63aeecd28b9bc9cf5476bac7a6ad3e62e5427c15f0a210335df271e75c89baa9";
    const GAMEDATAOBJID = "0x0a84bc3803250c79790245cf2c8ea8f74f9aa48efe5f40a30a205d9233cc5126";
    const GAME_TYPE = PACKAGE+"::mental_poker::PokerGame";
    EventBus.removeListener('action_join_and_pay');
    EventBus.on('action_join_and_pay', (scene_instance: Phaser.Scene) =>{

        // scene_instance.scene.start('Game', {
        //     "game_id":'0xcf6537e367c51f8931a5f6e8852c868af187697abacfa0e0ec25d992430745ea',
        //     "chip_amount": 100000000,
        // })

        if(joinProcessing){
            return;
        }
        setJoinProcessing(true);
        console.log("trigger join and pay")
        let tx = new Transaction()
        const betAmountCoin = tx.splitCoins(tx.gas, [
            0.1 * 1000000000,//0.1sui
        ]);
         tx.moveCall({
            package: PACKAGE,
            module: "mental_poker",
            function: "start_game",
            arguments: [
                betAmountCoin,
                tx.object(GAMEDATAOBJID),
            ]
        });
        let res =  signAndExecuteTransaction({transaction: tx},{
            onSuccess: async ({ digest }) => {
                const { effects,events,objectChanges } = await client.waitForTransaction({
                    digest: digest,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                        showEvents: true,
                    },
                });
                console.log("effects",effects);
                console.log("events",events);
                console.log("object change",objectChanges);
                let  gameID =""
                if (events && events.length>0){
                    for (var i=0;i<events?.length;i++){
                        if (events[i].parsedJson && events[i].parsedJson.game_id) {
                            gameID = events[i].parsedJson.game_id;
                            console.log("found game id on event",gameID);
                            break;
                        }
                    }
                }
                if (gameID=="" && objectChanges && objectChanges.length>0){
                    for (var i=0;i<objectChanges.length;i++){
                        if (objectChanges[i]["objectType"] == GAME_TYPE) {
                            gameID = objectChanges[i]["objectId"];
                            console.log("found game id on objchange",gameID);
                            break;
                        }
                    }
                }
                console.log(gameID)
                // let gameIDs = events?.find((obj) => {
                //     if (obj.parsedJson?.game_id) {
                //         return obj.parsedJson?.game_id;
                //     }
                // });
                // console.log("gameIDs",gameIDs)
                // setJoinProcessing(false);
                if (gameID){
                    scene_instance.scene.start('Game', {
                        "game_id":gameID,
                        "chip_amount": 100000000,
                    })
                }
            },
            onError: (error) => {
                console.log("Error = ", error);
                setJoinProcessing(false);
            }
        });
        setJoinProcessing(false);
        console.log("action_join_and_pay res",res)
    })

    return (
        <div id="app">
            <div>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} account={account}
                            actionLogin={actionLoginFunction}/>

            </div>
            <div ref={connectBTNRef} className="connect-button" style={{visibility: "hidden"}}>
                <ConnectButton className="connectBtn" />
            </div>
        </div>
    )
}

export default App
