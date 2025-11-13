import { use } from "react";

export default function VideoPage({ params }) {
  const { id } = use(params);
  return <h1>Video ID: {id}</h1>;
}
