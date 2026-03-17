declare module '@/data/siteMetadata' {
  const value: {
    title: string;
    author: string;
    email?: string;
    github?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
    bluesky?: string;
    x?: string;
    instagram?: string;
    threads?: string;
    medium?: string;
    stickyNav?: boolean;
    headerTitle?: string | JSX.Element;
  };
  export default value;
}
