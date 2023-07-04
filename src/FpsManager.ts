export class FpsManager {
    public Current: number = 0;

    private samples = Array<number>();
    private lastTimeStamp: number = 0;

    update(timeStamp: number): void {
        this.samples.unshift(1.0 / ((timeStamp - this.lastTimeStamp) / 1000.0));
        this.lastTimeStamp = timeStamp;
      
        if (this.samples.length > 100) this.samples.pop();
      
        let fpsSum: number = 0;
        this.samples.forEach(sample => fpsSum += sample);
        
        this.Current = Math.round(fpsSum / this.samples.length);
    }
}