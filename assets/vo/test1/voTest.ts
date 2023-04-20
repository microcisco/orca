import { Simulator } from "../RVO/Simulator";
import { RVOMath, Vector2 } from "../RVO/Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class voTest extends cc.Component {

    public target: Vector2 = new Vector2(324, 0)
    public t1;


    public a1:cc.Node;

    public speed = 300;
    public nodeTable = {};
    start () {

        this.a1 = this.node.getChildByName('a1');

        let simulator = Simulator.instance;
        // simulator.setAgentDefaults(6, 4, 1, 0.1, 0.5,
        //     this.speed, new Vector2(0, 0));

        Simulator.instance.setAgentDefaults(200, 10, 0.0,
            1, 250, this.speed, new Vector2(0, 0));


        // 障碍物
        // simulator.addObstacle([
        //     new Vector2(-25, -100),
        //     new Vector2(25, -100),
        //     new Vector2(25, 100),
        //     new Vector2(-25, 100),
        // ])
        // simulator.processObstacles();

        let idx = simulator.addAgent(new Vector2(0,0));
        const agent = simulator.getAgent(idx);
        agent.radius_ = 50 // 半径
        simulator.setAgentMass(idx, 100000);

        // 增加小球
        this.createAgent(cc.v2(-324.839, 0),1);


    }

    createAgent(pos: cc.Vec2, mass: number) {
        let simulator = Simulator.instance;
        let idx = simulator.addAgent(new Vector2(pos.x, pos.y));
        simulator.setAgentMass(idx, mass);

        const agent = simulator.getAgent(idx);
        agent.radius_ = 25

        const node = cc.instantiate(this.a1);
        node.active = true;
        this.a1.parent.addChild(node);
        node['_rvoIndex'] = idx;
        this.nodeTable[idx] = node;
        this.t1 = idx;
        return node;
    }

    setPreferredVelocities() {
        const i = this.t1;
        let goalVector = this.target.minus(Simulator.instance.getAgentPosition(i));
        if(RVOMath.absSq(goalVector) > 1.0) {
            goalVector = RVOMath.normalize(goalVector).scale(this.speed);
        }
        if (RVOMath.absSq(goalVector) < RVOMath.RVO_EPSILON) {
            // Agent is within one radius of its goal, set preferred velocity to zero
            Simulator.instance.setAgentPrefVelocity (i, new Vector2 (0.0, 0.0));
        }
        else {
            Simulator.instance.setAgentPrefVelocity(i, goalVector);

            let angle = Math.random() * 2.0 * Math.PI;
            let dist = Math.random() * 0.0001;
            Simulator.instance.setAgentPrefVelocity(i,
                Simulator.instance.getAgentPrefVelocity(i).plus(new Vector2(Math.cos(angle), Math.sin(angle)).scale(dist)));
        }
    }

    update(dt: number) {
        // 更新逻辑坐标
        this.setPreferredVelocities();
        Simulator.instance.run(dt);

        // 更新渲染坐标
        for(let i = 0; i < Simulator.instance.getNumAgents(); i++) {
            let p = Simulator.instance.getAgentPosition(i);

            this.nodeTable[this.t1].x = p.x;
            this.nodeTable[this.t1].y = p.y;

            // this.mSpheres[i]['setWorldPosition'](p.x, 0, p.y);
        }
    }

}
