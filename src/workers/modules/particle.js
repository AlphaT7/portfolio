export default class Particle {
    constructor(x, y, randomRadius, randomColor) {
        this.x = x;
        this.y = y;
        // Generate a random direction
        const angle = Math.random() * 2 * Math.PI;
        const speed = 0.65; // Set your desired consistent speed here (smaller = slower)
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.color = randomColor;
        this.radius = randomRadius;
    }

    update(ctx, shapePath) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        const particleMovement = {
            x: this.x + this.velocity.x,
            y: this.y + this.velocity.y
        };

        if (!ctx.isPointInPath(shapePath, particleMovement.x, particleMovement.y)) {
            this.velocity.x *= -1;
            this.velocity.y *= -1;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}