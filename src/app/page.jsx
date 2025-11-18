import Image from "next/image";
import Link from "next/link"
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome to our Salamander Tracker</h1>
      <h3>Description:</h3>
      <p>Salamander Tracker is an app that lets the user track the middle of the largest group of similar pixels as it moves around in a video. To begin continue to videos and select a video to process. You will be directed to choose a color to track and a threshold for other similar colors to consider as part of the group</p>
      <p>Note: videos with a plain background will be more reliable.</p>
      <Link href="/videos">
        <h2>videos...</h2>
      </Link>
      
    </div>
  );
}
