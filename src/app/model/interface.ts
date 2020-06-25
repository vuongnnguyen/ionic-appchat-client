export interface friendAccept{
    _id: string;
    idsend: string; // trung voi cai nay
    idto: string;
    created: number;
    name: string;
    urlImg: string;
    // _idfriend: string;
    //invite-frined
};

export interface User{
    _id: string;
    name: string;
    userName: string;
    friends: Array<any>;
    room: Array<any>
    active: boolean;
    // idsk: string;
    // _id: string;
    // userName: string;
    // passWord: string;
    urlImg: string;
    created: number;
    notification: Array<any>;
    waitaccept: Array<any>;
    friendaccepts: Array<any>;
    msg: Array<any>;
    dismissroom: Array<any>;
    hidemsg: Array<any>;
    block: Array<any>;
    // room: Array<any>;
    // login
};

export interface  message{
    _id: string;
    seen: boolean;
    msg: string;
    created: number;
    roomname: string;
  
    idsend: string;
    urlImg: string;
    name: string;
  
    nickname: string;
    // msg page
}

export interface handelNickName{
    id: string; 
    name: string;
    nickname: string;
    urlImg: string
    // msg page
}

export interface Notifican{
    _id: String;
    _idsend: String;
    msg: String;
    urlImg: String;
    created: Number;
    server: Boolean;
    status: String;
    name: String;
    // notifican
}

//services 

export interface listAccept{
    _id: string;
    name: string;
    urlImg: string;
}

export interface nickName {
    iduser: string;
    name: string;
    nameroom: string;
    seen: number;
    created: number;
  }

  export interface room {
    idroom: string;
    name: string;
    color: string;
    type: string;
    created: number;
    urlImg: string;
    countBlock: number;
  }
  // name: { type: String},
  // color: { type: String, default: 'blue'},
  // type: { type: String},
  // created: { type: Number}
  
  export interface objMsgUser{
    user: Array<listAccept>;
    listMsg: Array<msg>;
    room: Array<room>;
    nickname: Array<nickName>;
  }
  export interface objMessage{
    user: Array<listAccept>;
    listMsg: Array<msg>;
    room: room;
    nickname: Array<nickName>;
  }  

 
  export interface objUser {
    id: string;
    name: string;
    nickname: string;
    seen: number;
    img?: string;
  }
  export interface  msg{
    _id: string;
    seen: boolean;
    msg: string;
    created: number;
    roomname: string;
  
    idsend: string;
    urlImg: string;
    name: string;
  
    room: string; //ten room cua room
    color: string; // room
    type: string; // loai room
  
    nickname: string; // name ben nickname
  
    listNameUser: objUser[];
    
  
    // idDelete: string;
    // idUserDlt: string;
    // deletemsg: Array<any>;
    // deleteallmsg: number;
    // createdDlt: number;
  
  }

  export interface userSeach{
    _id: string;
    urlImg: string;
    name: string;
    userName: string;
  };

  export interface statusUser {
    _id: string;
    urlImg: string;
    name: string;
    isOffline : boolean;
    timeOff : number;
  }

