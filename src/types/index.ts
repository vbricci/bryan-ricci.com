export interface ISession {
  _id?: string
  token: string
  session: string
  locked: boolean
  user: IUser
  device: IDevice
  client: string
  isSandbox: boolean
  created: Date
  expires: number
}

export interface IDevice {
  _id?: string
  ipAddress: string
  client: {
    type: string
    name: string
    version: string
    engine: string
    engineVersion: string
    url: string
  }
  os: {
    name: string
    version: string
    platform: string
  }
  device: {
    type: string
    brand: string
    model: string
  }
}

export interface IUser {
  _id?: string
  active: boolean
  username: string
  firstName: string
  lastName: string
  dob: Date | string
  emailAddress: string
  password: string
  secondFactor?: number
  secondFactorExpires?: number
  lastModifiedDate?: number
  created?: number
  devices?: IDevice[]
  accountVerificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: number
  salt?: string

  // Not saved in DB
  key?: string
}