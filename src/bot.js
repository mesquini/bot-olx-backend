const puppeteer = require("puppeteer");

export async function bot(search) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://m.olx.com.br/busca?ca=19_s&q=${search}&w=1`);
  await page.setViewport({
    width: 800,
    height: 800,
  });

  await autoScroll(page);

  const prodsList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("#ad-list > li");

    const array = [...nodeList];

    const list = array
      .map((li) => {
        if (li.firstElementChild.href) {
          const tagsP = li.getElementsByTagName("p");

          let price = "Preço não informado";
          let date = "";

          if (tagsP.length === 2) {
            price = tagsP[0].innerText;
            date = tagsP[1].innerText;
          } else date = tagsP[0].innerText;

          return {
            src: li.firstElementChild.href,
            image: li
              .getElementsByTagName("img")[0]
              .src.replace("thumbs256x256", "images"),
            infos: {
              title: li.getElementsByTagName("h2")[0].innerText,
              price,
              date,
            },
          };
        }
      })
      .filter((li) => li);

    return list;
  });

  // fs.writeFile("olx_list.json", JSON.stringify(prodsList, null, 2), (err) => {
  //   if (err) throw new Error("something went wrong");

  //   console.log("well done!");
  // });

  await browser.close();

  return prodsList;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
