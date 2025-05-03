import React, { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import '../../css/PokerTable.css';

interface Player {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  cards?: string[];
  position: string;
  isAllIn?: boolean;
  isActive?: boolean;
  isCurrent?: boolean;
}

interface PokerTableProps {
  roomId: string;
  betLimit: string;
  players: Player[];
  currentPlayer?: string;
  onAction?: (action: string, amount?: number) => void;
}

export function PokerTable({
  roomId = '10089',
  betLimit = '200/400',
  players = [
    // 再次根据最新设计图确认位置
    {
      id: '7',
      name: 'Sunny',
      avatar: '/avatars/avatar7.png',
      balance: 898612,
      position: 'left' // 左侧
    },
    {
      id: '1',
      name: 'David',
      avatar: '/avatars/avatar1.png',
      balance: 898612,
      position: 'bottom-left' // 左下
    },
     {
      id: '6',
      name: '跟注', 
      avatar: '/avatars/avatar6.png',
      balance: 898612,
      position: 'top-left' // 左上
    },
    {
      id: '2',
      name: 'Amily',
      avatar: '/avatars/avatar2.png',
      balance: 898612,
      position: 'bottom' // 正下方
    },
    {
      id: '5',
      name: '胖大海爱吃鱼',
      avatar: '/avatars/avatar5.png',
      balance: 898612,
      position: 'center', // 中央（当前玩家）
      isCurrent: true
    },
    {
      id: '3',
      name: '加注', 
      avatar: '/avatars/avatar3.png',
      balance: 898612,
      position: 'top-right' // 右上
    },
    {
      id: '4',
      name: 'John',
      avatar: '/avatars/avatar4.png',
      balance: 898612,
      position: 'right', // 右侧
      isAllIn: true
    },
  ],
  currentPlayer,
  onAction
}: PokerTableProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [playerCards, setPlayerCards] = useState<string[]>(['Q♥', 'A♠']);
  
  // 处理玩家操作
  const handleAction = (action: string) => {
    setSelectedAction(action);
    if (onAction) {
      onAction(action, action === 'bet' ? betAmount : undefined);
    }
  };

  // 处理下注金额选择
  const handleBetAmountSelect = (amount: number) => {
    setBetAmount(amount);
  };

  return (
    <Box className="poker-table-container">
      {/* 顶部导航栏 */}
      <Flex className="table-header" justify="between" align="center">
        <Box className="menu-button">
          <span>≡</span>
        </Box>
        <Box className="room-info">
          <Text>房号: {roomId} 盲注:{betLimit}</Text>
        </Box>
        <Box className="balance-display">
          <Text className="coin-icon">¥</Text>
        </Box>
      </Flex>

      {/* 扑克桌 */}
      <Box className="poker-table">
        <Box className="table-inner">
          <Box className="table-logo">BOYAA POKER</Box>
        </Box>
        
        {/* 玩家位置 */}
        {players.map((player) => (
          <Box 
            key={player.id} 
            className={`player-position ${player.position} ${player.isCurrent ? 'current-player' : ''}`}
          >
            {/* 筹码移到头像上方 */}
            <Box className="player-bet-chips">
              <Text className="chip-amount">140K</Text>
            </Box>
            <Box className="player-avatar">
              <img src={player.avatar} alt={player.name} />
            </Box>
            <Text className="player-name">{player.name}</Text>
            <Text className="player-balance">$ {player.balance.toLocaleString()}</Text>
            {player.isAllIn && <Text className="player-status">ALL IN</Text>}
            {/* 中央玩家的牌显示逻辑移到外部 */}
          </Box>
        ))}

        {/* 中央玩家的牌 - 单独处理 */}
        <Box className="center-cards">
          <Box className="card card-q">Q♥</Box>
          <Box className="card card-a">A♠</Box>
        </Box>
      </Box>

      {/* 玩家操作区 */}
      <Flex className="player-actions" justify="center" align="center" gap="4">
        <Box className="bet-amount-options">
          <Box className="bet-chip chip-100" onClick={() => handleBetAmountSelect(100)}>100</Box>
          <Box className="bet-chip chip-500" onClick={() => handleBetAmountSelect(500)}>500</Box>
          <Box className="bet-chip chip-1k" onClick={() => handleBetAmountSelect(1000)}>1K</Box>
        </Box>
        
        <Flex className="action-buttons" gap="2">
          <Box 
            className="action-button bet-button" 
            onClick={() => handleAction('bet')}
          >
            要牌
          </Box>
          <Box 
            className="action-button fold-button" 
            onClick={() => handleAction('fold')}
          >
            不要牌
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}