
import { Store, registerInDevtools } from "pullstate";


export const AuthStore = new Store({
  isLoggedIn: false,
});

export const PropertyId = new Store({
  propertyId: '',
});


export const DocumentsList = new Store({
  documentsList: [],
});

export const ImagesList = new Store({
  imagesList: [],
});
export const GeoTaggingList = new Store({
  geoTaggingList: [],
});

export const PreviousImagesList = new Store({
  previousImagesList: [],
});
export const PreviousGeoTaggingList = new Store({
  previousGeoTaggingList: [],
});

export const Geofencing = new Store({
  geofencing: [],
});
export const CommentBox = new Store({
  commentBox: '',
});
export const UserToken = new Store({
  userToken: '',
});

export const UserId = new Store({
  userId: '',
});

export const UserFirstName = new Store({
  userFirstName: '',
});

export const UserLastName = new Store({
  userLastName: '',
});

export const UserMobile = new Store({
  userMobile: '',
});


export const ServiceName = new Store({
  serviceName: '',
});
export const ServiceId = new Store({
  serviceId: '',
});
registerInDevtools({AuthStore,PropertyId,Geofencing,UserId,UserToken,
  UserMobile,ServiceName,ServiceId,UserLastName,UserFirstName,CommentBox,
  DocumentsList,ImagesList,GeoTaggingList,PreviousGeoTaggingList,PreviousImagesList});




