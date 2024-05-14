import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col">
      <Navbar />
      <div className="lg:w-[70%] self-center w-full">
        <div className="flex flex-row gap-4 text-3xl font-bold">
          <h1 className="text-accent-300 hover:cursor-pointer">Ongoing</h1>
          <h1 className="text-gray-500 hover:cursor-pointer">Finished</h1>
        </div>
        <div className="my-4 flex w-full gap-4">
          <div className="flex flex-col p-4 bg-magic-gray rounded-2xl w-1/3 gap-2 hover:cursor-pointer">
            <img
              className="w-full max-h-full"
              src="https://imgs.search.brave.com/JvEo1Tnh_a2ohg-IyzF9nG-R8aP5T-WeiW_tjCKNxPs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/cmQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzA0L0dl/dHR5SW1hZ2VzLTEw/MTAwMjAxLXNjYWxl/ZC5qcGc"
              alt="gg"
            />

            <h1 className="text-xl">Fundraising #101</h1>
            <p className="text-gray-400">
              This project is raising money to teach people how to raise money!
            </p>
          </div>

          <div className="flex flex-col p-4 bg-magic-gray rounded-2xl w-1/3 gap-2 hover:cursor-pointer">
            <img
              className="w-full max-h-full"
              src="https://imgs.search.brave.com/JvEo1Tnh_a2ohg-IyzF9nG-R8aP5T-WeiW_tjCKNxPs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/cmQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzA0L0dl/dHR5SW1hZ2VzLTEw/MTAwMjAxLXNjYWxl/ZC5qcGc"
              alt="gg"
            />

            <h1 className="text-xl">Fundraising #101</h1>
            <p className="text-gray-400">
              This project is raising money to teach people how to raise money!
            </p>
          </div>

          <div className="flex flex-col p-4 bg-magic-gray rounded-2xl w-1/3 gap-2 hover:cursor-pointer">
            <img
              className="w-full max-h-full"
              src="https://imgs.search.brave.com/JvEo1Tnh_a2ohg-IyzF9nG-R8aP5T-WeiW_tjCKNxPs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/cmQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzA0L0dl/dHR5SW1hZ2VzLTEw/MTAwMjAxLXNjYWxl/ZC5qcGc"
              alt="gg"
            />

            <h1 className="text-xl">Fundraising #101</h1>
            <p className="text-gray-400">
              This project is raising money to teach people how to raise money!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
