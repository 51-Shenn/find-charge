export interface OCMConnection {
  ID: number;
  ConnectionTypeID?: number;
  ConnectionType?: {
    ID: number;
    Title: string;
    FormalName?: string;
  };
  LevelID?: number;
  Level?: {
    ID: number;
    Title: string;
    Comments?: string;
    IsFastChargeCapable: boolean;
  };
  PowerKW?: number;
  Quantity?: number;
  StatusType?: {
    ID: number;
    Title: string;
    IsOperational: boolean;
  };
}

export interface OCMAddressInfo {
  ID: number;
  Title: string;
  AddressLine1?: string;
  AddressLine2?: string;
  Town?: string;
  StateOrProvince?: string;
  Postcode?: string;
  Country?: {
    ID: number;
    Title: string;
    ISOCode: string;
  };
  Latitude: number;
  Longitude: number;
  Distance?: number;
  DistanceUnit?: number;
}

export interface OCMLocation {
  ID: number;
  UUID: string;
  DataProviderID?: number;
  OperatorID?: number;
  OperatorInfo?: {
    ID: number;
    Title: string;
    WebsiteURL?: string;
    PhonePrimaryContact?: string;
  };
  UsageTypeID?: number;
  UsageType?: {
    ID: number;
    Title: string;
    IsPayAtLocation?: boolean;
    IsMembershipRequired?: boolean;
    IsAccessKeyRequired?: boolean;
  };
  StatusType?: {
    ID: number;
    Title: string;
    IsOperational: boolean;
  };
  AddressInfo: OCMAddressInfo;
  NumberOfPoints?: number;
  GeneralComments?: string;
  DatePlanned?: string;
  Connections: OCMConnection[];
  MediaItems?: {
    ID: number;
    ItemURL: string;
    ItemThumbnailURL?: string;
  }[];
}

export interface OCMApiResponse {
  locations: OCMLocation[];
}

export interface Station {
  id: number;
  uuid: string;
  name: string;
  address: string;
  town?: string;
  state?: string;
  postcode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  operator?: string;
  usageType?: string;
  isPayAtLocation?: boolean;
  isOperational: boolean;
  numberOfPoints?: number;
  connections: {
    type: string;
    powerKW?: number;
    quantity?: number;
    isFastCharge: boolean;
    isOperational: boolean;
  }[];
  images: string[];
  comments?: string;
}

export interface Favorite {
  id: number;
  user_id: string;
  station_id: string;
  station_data: Station;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: Partial<Omit<Favorite, 'id'>>;
      };
    };
  };
}
