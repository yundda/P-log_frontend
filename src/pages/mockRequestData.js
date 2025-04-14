export const mockRequestList = [
  {
    requestId: 1,
    requesterNick: '짱구',
    petName: '흰둥이',
    type: 'permission', // 'permission' | 'invite'
    status: 'pending', // 'pending' | 'accepted' | 'rejected'
  },
  {
    requestId: 2,
    requesterNick: '짱아',
    petName: '초코',
    type: 'invite',
    status: 'pending',
  },
  {
    requestId: 3,
    requesterNick: '철수',
    petName: '복실이',
    type: 'invite',
    status: 'accepted',
  },
  {
    requestId: 4,
    requesterNick: '맹구',
    petName: '나비',
    type: 'permission',
    status: 'rejected',
  },
];
