### ORCA避障算法
####快速使用
* 设置默认代理
```
       Simulator.instance.setAgentDefaults(200, 10, 0.0, 1, 250, this.speed, new Vector2(0, 0));
```
* 设置代理
```
        let idx = simulator.addAgent(new Vector2(0,0));
        const agent = simulator.getAgent(idx);
        agent.radius_ = 50 // 半径
        simulator.setAgentMass(idx, 100000);
```
* 更新坐标
```
        this.setPreferredVelocities();
        Simulator.instance.run(dt);
```
####引用
![avatar](https://github.com/microcisco/astartForTS/blob/master/1.png)
1. 用的这个库，在使用的过程改了几个bug,性能目前还没优化，后续优化性能后会更新 https://github.com/shangdibaozi/RVO