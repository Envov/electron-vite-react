import { app, BrowserWindow, ipcMain, Notification,dialog } from 'electron'
import sharp from "sharp"
import fse from "fs-extra"
import path from "path"
import { resolve } from 'node:path'
import { readdirSync } from 'original-fs'
export default (mainWindow)=>{
    ipcMain.on('start', async (event, targetPath: string, sources: string[]) => {
        // 删除目标文件夹内容
        fse.removeSync(targetPath)
        fse.mkdirSync(targetPath)
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
        for (let xx of sources){
            const Names= fse.readdirSync(xx,{withFileTypes:true,encoding:"utf-8"})
            const whoXWho = path.posix.basename(xx).match(/\dx\d/)[0]
            for (let Name of Names) {
                const FileName = Name.name.match(/(.+)\./)[1]

                console.log(resolve(xx, Name.name))

                fse.copySync(
                    resolve(xx, Name.name),
                    resolve(targetPath, `./${FileName}/picker所需资源/${whoXWho}.png`),
                )
               

                fse.copySync(
                    resolve(xx, Name.name),
                    resolve(targetPath, `./${FileName}/桌面所需资源/${whoXWho}.png`),
                )


                fse.copySync(
                    resolve(xx, Name.name),
                    resolve(targetPath, `./${FileName}/桌面所需资源/2K/${whoXWho}.png`),
                )

                if (whoXWho === '2x2') {
                    let buffer = await sharp(resolve(xx, Name.name)).resize(160, 160).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/picker所需资源/不带外框160.png`), buffer)
                    
                    buffer = await sharp(resolve(xx, Name.name)).resize(122, 122).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/外框122.png`), buffer)
                    buffer = await sharp(resolve(xx, Name.name)).resize(168, 168).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/外框168.png`), buffer)
                    buffer = await sharp(resolve(xx, Name.name)).resize(224, 224).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/外框224.png`), buffer)
                    buffer = await sharp(resolve(xx, Name.name)).resize(587, 587).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x2.png`), buffer)

                    buffer = await sharp(resolve(xx, Name.name)).resize(486, 486).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/picker所需资源/汇总.png`), buffer)
                }
                if (whoXWho === '1x2') {
                    let buffer = await sharp(resolve(xx, Name.name)).resize(248, 587).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/2K/1x2.png`), buffer)
                }
                if (whoXWho === '2x1') {
                    let buffer = await sharp(resolve(xx, Name.name)).resize(587,214).toBuffer();
                    fse.writeFileSync(resolve(targetPath, `./${FileName}/桌面所需资源/2K/2x1.png`), buffer)
                }
            }

        }
        // fse.copySync()
        mainWindow.webContents.send('ok')
    })
    ipcMain.on('alert', async (event, title: string, body: string) => {
        dialog.showMessageBox({
            title,
            message: body,
            icon: ""
        })
    })
    
}