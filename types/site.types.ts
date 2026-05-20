export interface SocialLink {
  handle?: string
  name?: string
  url: string
}

export interface PhoneInfo {
  number: string
  flag: string
  label: string
}

export interface SiteConfig {
  name: string
  shortName: string
  email: string
  website: string
  location: string
  phones: {
    [key: string]: PhoneInfo
  }
  social: {
    instagram: SocialLink
    linkedin: SocialLink
  }
  copyrightYear: number
}
