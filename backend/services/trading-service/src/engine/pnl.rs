use common::trading::Position;

pub fn compute_unrealized_pnl(pos: &Position) -> f64 {
    let dir = if pos.side == "LONG" { 1.0 } else { -1.0 };
    (pos.mark - pos.entry) * pos.size * dir
}

pub fn refresh_pnl(positions: &mut [Position]) {
    for p in positions.iter_mut() {
        p.pnl = compute_unrealized_pnl(p);
    }
}

