import { app, BrowserWindow, ipcMain, Notification, dialog } from "electron";
import sharp from "sharp";
import fse from "fs-extra";
import path from "path";
import { resolve } from "node:path";
import { readdirSync } from "original-fs";
export default (mainWindow) => {
  ipcMain.on('move', async (event, finedFIles, pathFile)=>{
    fse.removeSync(resolve(pathFile + '/新建文件夹/'));
    fse.mkdirSync(resolve(pathFile + '/新建文件夹/'));
    for (let fileName of finedFIles){
      const f = resolve(pathFile, fileName)
      const t = resolve(pathFile + '/新建文件夹/', `./${fileName}`)
      function exists(path) {
        return new Promise(resolve => {
          fse.exists(path, resolve);
        })
      }
      if (await exists(f)){
        await fse.copySync(
          f,
          t,
        )
      }
    }
    mainWindow.webContents.send('moveok')
   
  })
  ipcMain.on("start", async (event, targetPath: string, sources: string[], { fangda = 3,
    mohu = 30,
    jyyj=false,
    hei = '0.3',
    yuanjiao = 22 }) => {
    // 删除目标文件夹内容
    fse.removeSync(targetPath);
    fse.mkdirSync(targetPath);
    // 删除文件完成
    //递归sources/1x2，
    /**
     * sources/whoXWho/Name.png拷贝到targetPath/Name/picker所需资源/whoXWho.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/不带外框160.png/不带外框160.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/桌面所需资源/whoXWho.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/桌面所需资源/外框122.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/桌面所需资源/外框168.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/桌面所需资源/外框224.png
     * sources/whoXWho/Name.png拷贝到targetPath/Name/桌面所需资源/2K/whoXWho.png
     */
    const resizeOptions = {
      withoutEnlargement: false,
      withoutReduction: false,
      fit: "fill",
    } as any
    for (let xx of sources) {
      const Names = fse.readdirSync(xx, {
        withFileTypes: true,
        encoding: "utf-8",
      });
      const whoXWho = path.posix.basename(xx).match(/\dx\d/)[0];

      for (let i = 0; i < Names?.length; i++) {
        const Name = Names[i];

        const FileName = Name.name.match(/(.+)\./)[1];

        // console.log(resolve(xx, Name.name))

        mainWindow.webContents.send(
          "progress",
          (i / Names?.length).toFixed(2),
          Name.name
        );
        fse.copySync(
          resolve(xx, Name.name),
          resolve(targetPath, `./${FileName}/picker所需资源/${whoXWho}.png`)
        );

        fse.copySync(
          resolve(xx, Name.name),
          resolve(targetPath, `./${FileName}/桌面所需资源/${whoXWho}.png`)
        );

        fse.copySync(
          resolve(xx, Name.name),
          resolve(targetPath, `./${FileName}/桌面所需资源/2K/${whoXWho}.png`)
        );

        if (whoXWho === "2x2") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(160, 160,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/picker所需资源/不带外框160.png`),
            buffer
          );

          buffer = await sharp(resolve(xx, Name.name))
            .resize(122, 122,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框122.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(168, 168,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框168.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(224, 224,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框224.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(587, 587,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x2.png`),
            buffer
          );
        }
        if (whoXWho === "1x2") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(248, 587,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/1x2.png`),
            buffer
          );
        }
        if (whoXWho === "2x1") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(587, 214,resizeOptions)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x1.png`),
            buffer
          );
        }
        // 处理汇总
        if (whoXWho === "2x2") {
          const rect = jyyj ? null : `<svg><rect  width="100%" height="100%" rx="${yuanjiao}" ry="${yuanjiao}"/></svg>`
           
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(486, 486,resizeOptions)
            .composite([

              {
                input: await sharp(resolve(xx, Name.name))
                  .resize(486 * fangda, 486 * fangda,resizeOptions)
                  .composite([
                    {
                      input: await sharp(
                        Buffer.from(
                          '<svg><rect  width="100%" height="100%" rx="0" ry="0"/></svg>'
                        )
                      )
                        .resize(486, 486,resizeOptions)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .extract({
                    left: (486 * fangda - 486)/2,
                    top: (486 * fangda - 486) / 2,
                    width: 486,
                    height: 486
                  }).
                  blur(mohu)
                  .toBuffer(),

                left: 0,
                top: 0,
              },

              {
                input: {
                  create: {
                    width: 486,
                    height: 486,
                    background: `rgba(0,0,0,${hei})`,
                    channels: 4,
                  }
                },
                top: 0,
                left: 0
              },

              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x2.png`)
                )
                  .resize(90, 90,resizeOptions)
                  .composite(rect?[
                    {
                      input: await sharp(
                        Buffer.from(
                          rect
                        )
                      )
                        .resize(90, 90,resizeOptions)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ]:[])
                  .toBuffer(),

                left: 67,
                top: 67,
              },

              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x2.png`)
                )
                  .resize(245, 245,resizeOptions)
                  .composite(rect?[
                    {
                      input: await sharp(
                        Buffer.from(
                          rect
                        )
                      )
                        .resize(245, 245,resizeOptions)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ]:[])
                  .toBuffer(),
                left: 174,
                top: 67,
                
              },
              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/1x2.png`)
                )
                  .resize(90, 245,{
                    withoutEnlargement:false,
                    withoutReduction:false,
                    fit: "fill",
                  })
                  .composite(jyyj?[]:[
                    {
                      input: await sharp(
                        Buffer.from(
                          `<svg><rect  width="90" height="245" rx="${Math.min(yuanjiao, 45)}" ry="${Math.min(yuanjiao, 45) }"/></svg>`
                        )
                      )
                        .resize(90, 245, {
                          fit:"fill",
                          withoutEnlargement: false,
                          withoutReduction: false
                        })
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),
                left: 67,
                top: 174,
                
              },
              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x1.png`)
                )
                  .resize(245, 90,resizeOptions)
                  .composite(jyyj?[]:[
                    {
                      input: await sharp(
                        Buffer.from(
                          `<svg><rect  width="245" height="90" rx="${Math.min(45, yuanjiao)}" ry="${ Math.min(yuanjiao,45)}"/></svg>`
                        )
                      )
                        .resize(245, 90,resizeOptions)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),
                left: 174,
                top: 328,
                
              },

            ])
            .toBuffer();

          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/picker所需资源/汇总.png`),
            buffer
          );
        }
      }
    }
    // fse.copySync()
    mainWindow.webContents.send("ok");
  });
  ipcMain.on("alert", async (event, title: string, body: string) => {
    dialog.showMessageBox({
      title,
      message: body,
      icon: "",
    });
  });
};
