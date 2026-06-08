import type { DetailedHTMLProps, HTMLAttributes } from "react";

type VidstackElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  title?: string;
  poster?: string;
  controls?: boolean;
  playsInline?: boolean;
  crossorigin?: string;
  thumbnails?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "media-player": VidstackElementProps;
      "media-provider": VidstackElementProps;
      "media-video-layout": VidstackElementProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "media-player": VidstackElementProps;
      "media-provider": VidstackElementProps;
      "media-video-layout": VidstackElementProps;
    }
  }
}

export {};
