export interface DRMConfig {
  playUrl: string;
  licenseUrl: string;
  token?: string;
  certificateUrl?: string; // FairPlay only
}

export interface VideoPlayerProps {
  widevine?: DRMConfig;
  fairplay?: DRMConfig;
  autoPlay?: boolean;
  controls?: boolean;
  style?: any;
  poster?:string;
}

