import { app, BrowserWindow, ipcMain, Notification, dialog } from "electron";
import sharp from "sharp";
import fse from "fs-extra";
import path from "path";
import { resolve } from "node:path";
import { readdirSync } from "original-fs";
export default (mainWindow) => {
  ipcMain.on("start", async (event, targetPath: string, sources: string[]) => {
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
            .resize(160, 160)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/picker所需资源/不带外框160.png`),
            buffer
          );

          buffer = await sharp(resolve(xx, Name.name))
            .resize(122, 122)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框122.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(168, 168)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框168.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(224, 224)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/外框224.png`),
            buffer
          );
          buffer = await sharp(resolve(xx, Name.name))
            .resize(587, 587)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x2.png`),
            buffer
          );
        }
        if (whoXWho === "1x2") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(248, 587)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/1x2.png`),
            buffer
          );
        }
        if (whoXWho === "2x1") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(587, 214)
            .toBuffer();
          fse.writeFileSync(
            resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x1.png`),
            buffer
          );
        }
        // 处理汇总
        if (whoXWho === "2x2") {
          let buffer = await sharp(resolve(xx, Name.name))
            .resize(486, 486)
            .blur(50)
            .gamma(2)
            .composite([
              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x2.png`)
                )
                  .resize(92, 92)
                  .composite([
                    {
                      input: await sharp(
                        Buffer.from(
                          '<svg><rect  width="100%" height="100%" rx="22" ry="22"/></svg>'
                        )
                      )
                        .resize(92, 92)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),

                left: 66,
                top: 65,
              },

              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x2.png`)
                )
                  .resize(245, 245)
                  .composite([
                    {
                      input: await sharp(
                        Buffer.from(
                          '<svg><rect  width="100%" height="100%" rx="22" ry="22"/></svg>'
                        )
                      )
                        .resize(245, 245)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),
                top: 65,
                left: 175,
              },
              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/1x2.png`)
                )
                  .resize(92, 245)
                  .composite([
                    {
                      input: await sharp(
                        Buffer.from(
                          '<svg><rect  width="92" height="245" rx="22" ry="22"/></svg>'
                        )
                      )
                        .resize(92, 245)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),
                top: 175,
                left: 65,
              },
              {
                input: await sharp(
                  resolve(targetPath, `./${FileName}/picker所需资源/2x1.png`)
                )
                  .resize(245, 90)
                  .composite([
                    {
                      input: await sharp(
                        Buffer.from(
                          '<svg><rect  width="245" height="90" rx="22" ry="22"/></svg>'
                        )
                      )
                        .resize(245, 90)
                        .toBuffer(),
                      left: 0,
                      top: 0,
                      blend: "dest-in",
                    },
                  ])
                  .toBuffer(),
                top: 326,
                left: 175,
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
