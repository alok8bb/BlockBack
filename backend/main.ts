import { Application, Router } from "https://deno.land/x/oak@v16.0.0/mod.ts";
import "https://deno.land/std@0.218.2/dotenv/load.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { connectDatabase } from "./db.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";
import Campaign, { CampaignMetadata } from "./campaign.model.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

export const MONGO_URI =
  Deno.env.get("MONGO_URI") || "mongodb://localhost:27017/BlockBack";
await connectDatabase(MONGO_URI);

const IMAGE_DIR = "./cover_images/";
if (!existsSync(IMAGE_DIR)) {
  Deno.mkdir(IMAGE_DIR);
}

const app = new Application();
app.use(
  oakCors({
    origin: "http://localhost:3000",
  })
);
const router = new Router();

router.post("/data/upload", async (ctx) => {
  const body = await ctx.request.body.formData();

  if (!body) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Request must contain a valid multi-part form",
    };
    return;
  }

  const image = body.get("cover_image");
  const data = body.get("data");
  if (image === null || data === null) {
    ctx.response.status = 400;
    ctx.response.body = {
      message:
        "Request data must be a valid JSON object along with cover_image file",
    };
    return;
  }

  let metadata: CampaignMetadata;

  try {
    if (typeof data !== "string") {
      throw new Error("Data must be in string format!");
    }

    metadata = JSON.parse(data) as CampaignMetadata;
  } catch (e) {
    console.error(e);
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Could not parse the metadata, please check the request body!",
    };
    return;
  }

  if (image instanceof File) {
    if (!image.type.startsWith("image")) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Please ensure that the cover image you provide is in a valid image format.",
      };
      return;
    }

    const fileId = crypto.randomUUID();
    const filePath = join(
      IMAGE_DIR + fileId + "." + image.name.split(".").pop()
    );
    console.log(image.size);
    if (image.size >= 10000000) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Please ensure cover image is not more than 10Mb in size!",
      };
    }

    await Deno.writeFile(
      `${filePath}`,
      new Uint8Array(await image.arrayBuffer())
    );

    try {
      const hash = crypto.randomUUID();
      await Campaign.create({ ...metadata, hash });
      ctx.response.status = 200;
      ctx.response.body = {
        message: "Campaign metadata saved successfully!",
        hash: hash,
      };
    } catch (e) {
      ctx.response.status === 400;
      ctx.response.body = {
        e,
      };
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is up and running!");
await app.listen({ port: 8000 });
