/**
 * 全部类型声明
 */

declare global {
}

interface Window {
    isolatedShare: {
        setTitle(title: string): void
        getFileChoosePath(): Promise<{
            canceled: boolean
            filePaths: Array<string>
        }>
    }
}