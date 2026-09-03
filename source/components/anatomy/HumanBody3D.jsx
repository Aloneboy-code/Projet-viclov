import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/* ─── Materials ─────────────────────────────────────────────────── */
const MAT = {
  bone:       () => new THREE.MeshPhongMaterial({ color: 0xf0e0c8, shininess: 40 }),
  muscle:     () => new THREE.MeshPhongMaterial({ color: 0xcc3333, shininess: 50, transparent: true, opacity: 0.88 }),
  artery:     () => new THREE.MeshPhongMaterial({ color: 0xdd1111, shininess: 70 }),
  vein:       () => new THREE.MeshPhongMaterial({ color: 0x2244bb, shininess: 70 }),
  nerve:      () => new THREE.MeshPhongMaterial({ color: 0xffe033, shininess: 60 }),
  lung:       () => new THREE.MeshPhongMaterial({ color: 0xffb0b0, shininess: 20, transparent: true, opacity: 0.82 }),
  liver:      () => new THREE.MeshPhongMaterial({ color: 0x7b3a10, shininess: 25 }),
  stomach:    () => new THREE.MeshPhongMaterial({ color: 0xee7755, shininess: 25 }),
  kidney:     () => new THREE.MeshPhongMaterial({ color: 0xaa4422, shininess: 25 }),
  intestine:  () => new THREE.MeshPhongMaterial({ color: 0xddaa77, shininess: 15 }),
  bladder:    () => new THREE.MeshPhongMaterial({ color: 0xddcc55, shininess: 20, transparent: true, opacity: 0.72 }),
  cartilage:  () => new THREE.MeshPhongMaterial({ color: 0xd0f0f0, shininess: 80, transparent: true, opacity: 0.7 }),
};

const tube = (points, mat, r = 0.015, seg = 20) => {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, 6, false), mat);
};

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* ─── SKELETON ──────────────────────────────────────────────────── */
function buildSkeleton(g) {
  const m = MAT.bone();
  const cm = MAT.cartilage();

  // Skull + mandible
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 20), m);
  skull.scale.set(1, 1.18, 1.05); skull.position.set(0, 3.22, 0); g.add(skull);
  const faceplate = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), m);
  faceplate.scale.set(0.95, 0.7, 0.55); faceplate.position.set(0, 3.05, 0.28); g.add(faceplate);
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 8), m);
  jaw.scale.set(1.1, 0.5, 0.85); jaw.position.set(0, 2.82, 0.12); g.add(jaw);

  // Spine
  const spineY = [2.56, 2.47, 2.38, 2.29, 2.20, 2.11, 2.02, 1.93, 1.84, 1.75,
                  1.66, 1.57, 1.48, 1.39, 1.30, 1.21, 1.12, 1.03, 0.94, 0.85, 0.76, 0.67, 0.58, 0.49];
  spineY.forEach((y, i) => {
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.07, 10), m);
    vert.position.set(0, y, -0.04 + Math.sin(i * 0.18) * 0.01); g.add(vert);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.025, 10), cm);
    disc.position.set(0, y - 0.048, -0.04); g.add(disc);
  });

  // Ribcage (24 ribs = 12 pairs)
  for (let i = 0; i < 12; i++) {
    [-1, 1].forEach(side => {
      const rx = (0.38 - i * 0.01) * side;
      const rz = 0.19 - i * 0.006;
      const ry = 2.44 - i * 0.115;
      const pts = [
        v3(0, ry, -0.04), v3(0.08 * side, ry + 0.04, 0.04),
        v3(rx * 0.7, ry + 0.02, rz * 0.9), v3(rx, ry - 0.06, rz * 0.5), v3(rx * 0.5, ry - 0.08, 0.18)
      ];
      const rib = tube(pts, m, 0.022, 10); g.add(rib);
    });
  }

  // Sternum
  const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.06), m);
  sternum.position.set(0, 1.9, 0.17); g.add(sternum);

  // Clavicles
  [-1, 1].forEach(s => {
    const clav = tube([v3(0.05 * s, 2.54, 0.12), v3(0.28 * s, 2.56, 0.1), v3(0.52 * s, 2.52, 0.04)], m, 0.03, 8);
    g.add(clav);
  });

  // Pelvis (ilium, sacrum, pubis)
  const sacrum = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.12), m);
  sacrum.position.set(0, 0.42, -0.08); g.add(sacrum);
  [-1, 1].forEach(s => {
    const ilium = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), m);
    ilium.scale.set(0.7, 0.55, 0.45); ilium.position.set(0.26 * s, 0.58, 0.01); g.add(ilium);
  });

  // Arms (humerus, radius, ulna, hand)
  [-1, 1].forEach(s => {
    const sx = 0.58 * s;
    // Humerus
    const hum = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.6, 10), m);
    hum.position.set(sx, 2.12, 0.02); g.add(hum);
    // Elbow joint
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), cm);
    elbow.position.set(sx, 1.8, 0.02); g.add(elbow);
    // Radius
    const rad = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.52, 8), m);
    rad.position.set(sx + 0.02 * s, 1.52, 0.03); g.add(rad);
    // Ulna
    const uln = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.52, 8), m);
    uln.position.set(sx - 0.02 * s, 1.52, 0); g.add(uln);
    // Wrist
    const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), cm);
    wrist.position.set(sx, 1.23, 0.03); g.add(wrist);
    // Hand metacarpals
    for (let f = -2; f <= 2; f++) {
      const mc = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.18, 6), m);
      mc.position.set(sx + f * 0.025 * s, 1.06, 0.04); g.add(mc);
    }
  });

  // Legs (femur, tibia, fibula, foot)
  [-1, 1].forEach(s => {
    const sx = 0.22 * s;
    // Femoral head
    const fh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), cm);
    fh.position.set(sx, 0.38, 0.01); g.add(fh);
    // Femur
    const fem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.78, 10), m);
    fem.position.set(sx, -0.05, 0.02); g.add(fem);
    // Knee
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), cm);
    knee.position.set(sx, -0.47, 0.02); g.add(knee);
    // Tibia
    const tib = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.04, 0.74, 10), m);
    tib.position.set(sx, -0.88, 0.02); g.add(tib);
    // Fibula
    const fib = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.7, 7), m);
    fib.position.set(sx + 0.055 * s, -0.88, 0.01); g.add(fib);
    // Ankle
    const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), cm);
    ankle.position.set(sx, -1.28, 0.02); g.add(ankle);
    // Foot
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.32), m);
    foot.position.set(sx, -1.36, 0.1); g.add(foot);
    // Toes
    for (let t = -2; t <= 2; t++) {
      const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.1, 5), m);
      toe.rotation.x = Math.PI / 2; toe.position.set(sx + t * 0.025 * s, -1.36, 0.28); g.add(toe);
    }
  });

  // Scapulas
  [-1, 1].forEach(s => {
    const sc = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.04), m);
    sc.rotation.z = 0.15 * s; sc.position.set(0.38 * s, 2.3, -0.1); g.add(sc);
  });
}

/* ─── MUSCLES ───────────────────────────────────────────────────── */
function buildMuscles(g) {
  const m = MAT.muscle();

  // Neck
  [-1, 1].forEach(s => {
    const scm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.38, 8), m);
    scm.position.set(0.07 * s, 2.62, 0.06); scm.rotation.z = -0.12 * s; g.add(scm);
  });

  // Pectorals
  [-1, 1].forEach(s => {
    const pec = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 10), m);
    pec.scale.set(0.9, 0.55, 0.5); pec.position.set(0.17 * s, 2.08, 0.2); g.add(pec);
  });

  // Deltoids
  [-1, 1].forEach(s => {
    const delt = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), m);
    delt.scale.set(0.7, 1, 0.8); delt.position.set(0.52 * s, 2.28, 0.02); g.add(delt);
  });

  // Abs (6-pack)
  for (let i = 0; i < 3; i++) {
    for (let j = -1; j <= 1; j += 2) {
      const ab = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), m);
      ab.scale.set(0.95, 0.7, 0.5); ab.position.set(j * 0.1, 1.72 - i * 0.18, 0.3); g.add(ab);
    }
  }

  // Obliques
  [-1, 1].forEach(s => {
    const obl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.55, 8), m);
    obl.rotation.z = 0.4 * s; obl.position.set(0.3 * s, 1.55, 0.1); g.add(obl);
  });

  // Trapezius
  const trap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), m);
  trap.scale.set(1.5, 0.5, 0.45); trap.position.set(0, 2.38, -0.06); g.add(trap);

  // Latissimus dorsi
  [-1, 1].forEach(s => {
    const lat = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), m);
    lat.scale.set(0.65, 1.1, 0.35); lat.position.set(0.36 * s, 2.0, -0.08); g.add(lat);
  });

  // Biceps / triceps
  [-1, 1].forEach(s => {
    const bic = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.48, 9), m);
    bic.position.set(0.6 * s, 2.08, 0.04); g.add(bic);
    const tri = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.46, 9), m);
    tri.position.set(0.6 * s, 2.08, -0.04); g.add(tri);
    // Forearm
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.44, 9), m);
    fore.position.set(0.6 * s, 1.52, 0); g.add(fore);
  });

  // Glutes
  [-1, 1].forEach(s => {
    const glute = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), m);
    glute.scale.set(0.75, 0.7, 0.6); glute.position.set(0.19 * s, 0.25, -0.12); g.add(glute);
  });

  // Quadriceps / hamstrings
  [-1, 1].forEach(s => {
    const quad = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.72, 10), m);
    quad.position.set(0.22 * s, -0.07, 0.05); g.add(quad);
    const ham = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.065, 0.7, 10), m);
    ham.position.set(0.22 * s, -0.07, -0.07); g.add(ham);
    // Calves
    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.045, 0.5, 9), m);
    calf.position.set(0.22 * s, -0.78, 0.03); g.add(calf);
  });
}

/* ─── CIRCULATORY ───────────────────────────────────────────────── */
function buildCirculatory(g) {
  const am = MAT.artery();
  const vm = MAT.vein();

  // Heart – more anatomical
  const hg = new THREE.Group(); hg.position.set(0.07, 2.02, 0.16);
  const hMain = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), am);
  hMain.scale.set(1, 1.25, 0.85); hg.add(hMain);
  const lv = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), am);
  lv.position.set(-0.07, -0.04, 0.04); hg.add(lv);
  const rv = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), vm);
  rv.position.set(0.07, -0.02, 0.04); hg.add(rv);
  const la = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), am);
  la.position.set(-0.1, 0.1, -0.04); hg.add(la);
  const ra = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), vm);
  ra.position.set(0.1, 0.1, -0.04); hg.add(ra);
  const apex = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), am);
  apex.position.set(-0.02, -0.17, 0.02); hg.add(apex);
  g.add(hg);

  // Aortic arch + descending aorta
  g.add(tube([v3(0.0,2.17,0.16), v3(0,2.42,0.12), v3(-0.05,2.52,0.04), v3(-0.04,2.1,0), v3(-0.03,1.4,0), v3(-0.02,0.5,0), v3(0,0.2,0)], am, 0.028, 30));
  // Superior vena cava
  g.add(tube([v3(0.12,2.18,0.14), v3(0.14,2.4,0.1), v3(0.1,2.6,0.04)], vm, 0.022, 12));
  // Inferior vena cava
  g.add(tube([v3(0.12,2.18,0.12), v3(0.12,1.5,0.02), v3(0.1,0.5,0), v3(0.08,0.2,0)], vm, 0.022, 18));
  // Pulmonary arteries
  g.add(tube([v3(0.07,2.2,0.16), v3(0.28,2.18,0.06), v3(0.38,2.08,0)], vm, 0.018, 10));
  g.add(tube([v3(0.07,2.2,0.16), v3(-0.14,2.18,0.06), v3(-0.28,2.08,0)], vm, 0.018, 10));
  // Pulmonary veins
  g.add(tube([v3(0.36,2.04,0), v3(0.22,2.1,0.08), v3(0.05,2.12,0.14)], am, 0.014, 10));
  g.add(tube([v3(-0.26,2.04,0), v3(-0.12,2.1,0.08), v3(-0.03,2.12,0.14)], am, 0.014, 10));
  // Carotids
  g.add(tube([v3(-0.03,2.5,0.06), v3(0.07,2.72,0.05), v3(0.08,3.05,0)], am, 0.016, 12));
  g.add(tube([v3(-0.03,2.5,0.06), v3(-0.07,2.72,0.05), v3(-0.08,3.05,0)], am, 0.016, 12));
  // Subclavian → brachial
  [-1,1].forEach(s => {
    g.add(tube([v3(0,2.45,0.04), v3(0.3*s,2.38,0.02), v3(0.58*s,2.18,0.02), v3(0.6*s,1.7,0), v3(0.6*s,1.22,0.02)], am, 0.013, 20));
    g.add(tube([v3(0.62*s,1.22,0.02), v3(0.62*s,1.7,0.02), v3(0.6*s,2.18,0.02), v3(0.32*s,2.38,0.02)], vm, 0.011, 18));
  });
  // Iliac → femoral
  [-1,1].forEach(s => {
    g.add(tube([v3(0,0.2,0), v3(0.12*s,0.1,0.02), v3(0.22*s,-0.1,0.02), v3(0.22*s,-0.6,0.02), v3(0.22*s,-1.3,0)], am, 0.016, 22));
    g.add(tube([v3(0.24*s,-1.3,0.02), v3(0.24*s,-0.6,0.02), v3(0.24*s,-0.1,0.02), v3(0.14*s,0.1,0.02), v3(0.02*s,0.2,0.02)], vm, 0.014, 22));
  });
  // Renal arteries
  [-1,1].forEach(s => {
    g.add(tube([v3(-0.04,1.38,0.01), v3(0.18*s,1.38,0.01)], am, 0.012, 6));
  });
  // Celiac / mesenteric
  g.add(tube([v3(-0.03,1.65,0.02), v3(-0.03,1.55,0.12), v3(0.04,1.45,0.14)], am, 0.013, 8));
}

/* ─── NERVOUS SYSTEM ────────────────────────────────────────────── */
function buildNervous(g) {
  const m = MAT.nerve();

  // Brain
  const brain = new THREE.Mesh(new THREE.SphereGeometry(0.27, 20, 20), m);
  brain.scale.set(1, 0.88, 1.05); brain.position.set(0, 3.22, 0); g.add(brain);
  // Cerebellum
  const cb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), m);
  cb.scale.set(1.2, 0.7, 0.85); cb.position.set(0, 3.0, -0.14); g.add(cb);
  // Brainstem
  const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.22, 10), m);
  bs.position.set(0, 2.82, -0.06); g.add(bs);

  // Spinal cord
  g.add(tube([v3(0,2.78,-0.06), v3(0,2.4,-0.05), v3(0,1.8,-0.04), v3(0,1.0,-0.03), v3(0,0.28,-0.02)], m, 0.028, 30));

  const n = (pts, r = 0.008) => g.add(tube(pts.map(([x,y,z]) => v3(x,y,z)), m, r, 10));

  // Cranial nerve exits
  for (let i = 0; i < 5; i++) {
    n([[0.04, 3.1 - i * 0.04, 0.18], [0.12, 3.08 - i * 0.04, 0.22]], 0.006);
    n([[-0.04, 3.1 - i * 0.04, 0.18], [-0.12, 3.08 - i * 0.04, 0.22]], 0.006);
  }

  // Brachial plexus
  [-1,1].forEach(s => {
    n([[0,2.5,-0.04],[0.25*s,2.35,0.02],[0.55*s,2.05,0.01],[0.6*s,1.7,0],[0.6*s,1.22,0]], 0.009);
    // Median + ulnar + radial
    n([[0.6*s,1.22,0],[0.6*s,0.98,0.01],[0.58*s,0.85,0.02]], 0.005);
  });

  // Intercostal nerves
  for (let i = 0; i < 8; i++) {
    [-1,1].forEach(s => n([[0,2.42-i*0.13,-0.04],[0.2*s,2.4-i*0.13,0.08],[0.38*s,2.36-i*0.13,0.14]], 0.005));
  }

  // Lumbar plexus
  for (let i = 0; i < 4; i++) {
    [-1,1].forEach(s => n([[0,0.28+i*0.06,-0.02],[0.12*s,0.2+i*0.04,0.04],[0.22*s,0.1+i*0.02,0.06]], 0.006));
  }

  // Sciatic nerves
  [-1,1].forEach(s => {
    n([[0,0.28,-0.03],[0.12*s,0,-0.04],[0.22*s,-0.55,-0.03],[0.22*s,-1.28,-0.01],[0.22*s,-1.5,0.04]], 0.012);
    // Branch below knee
    n([[0.22*s,-1.28,-0.01],[0.2*s,-1.5,0.06],[0.18*s,-1.6,0.1]], 0.007);
  });
}

/* ─── ORGANS ────────────────────────────────────────────────────── */
function buildOrgans(g) {
  // Lungs
  const lm = MAT.lung();
  const lr = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), lm);
  lr.scale.set(0.78, 1.25, 0.65); lr.position.set(0.24, 2.1, 0.02); g.add(lr);
  const ll = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), lm);
  ll.scale.set(0.72, 1.18, 0.62); ll.position.set(-0.22, 2.1, 0.02); g.add(ll);
  // Lower lobes
  const llr = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), lm);
  llr.scale.set(0.8, 0.8, 0.6); llr.position.set(0.28, 1.72, 0.06); g.add(llr);
  const lll = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), lm);
  lll.scale.set(0.75, 0.78, 0.6); lll.position.set(-0.26, 1.72, 0.06); g.add(lll);

  // Trachea + bronchi
  const trm = MAT.cartilage();
  g.add(tube([v3(0,2.62,0.1), v3(0,2.42,0.1), v3(0,2.24,0.1)], trm, 0.028, 12));
  g.add(tube([v3(0,2.24,0.1), v3(0.2,2.16,0.08), v3(0.32,2.08,0.04)], trm, 0.02, 8));
  g.add(tube([v3(0,2.24,0.1), v3(-0.18,2.16,0.08), v3(-0.28,2.08,0.04)], trm, 0.02, 8));

  // Liver
  const livm = MAT.liver();
  const liver = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), livm);
  liver.scale.set(1.35, 0.68, 0.65); liver.position.set(0.15, 1.56, 0.1); g.add(liver);

  // Gallbladder
  const gbm = new THREE.MeshPhongMaterial({ color: 0x4a7a3a, shininess: 30 });
  const gb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), gbm);
  gb.scale.set(0.7, 1.2, 0.6); gb.position.set(0.22, 1.44, 0.18); g.add(gb);

  // Stomach
  const stm = MAT.stomach();
  const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), stm);
  stomach.scale.set(0.9, 1.28, 0.72); stomach.position.set(-0.1, 1.52, 0.12); g.add(stomach);

  // Spleen
  const splm = new THREE.MeshPhongMaterial({ color: 0x7755aa, shininess: 25 });
  const spleen = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), splm);
  spleen.scale.set(0.75, 1, 0.6); spleen.position.set(-0.3, 1.56, 0.04); g.add(spleen);

  // Pancreas
  const panm = new THREE.MeshPhongMaterial({ color: 0xcc9955, shininess: 20 });
  const panc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), panm);
  panc.scale.set(1.5, 0.5, 0.5); panc.position.set(-0.05, 1.42, 0.04); g.add(panc);

  // Kidneys
  const km = MAT.kidney();
  [-1,1].forEach(s => {
    const k = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), km);
    k.scale.set(0.68, 1.25, 0.58); k.position.set(0.2*s, 1.35, -0.1); g.add(k);
    // Adrenal
    const adrm = new THREE.MeshPhongMaterial({ color: 0xddaa33, shininess: 30 });
    const adr = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), adrm);
    adr.scale.set(0.7, 0.9, 0.6); adr.position.set(0.2*s, 1.48, -0.1); g.add(adr);
  });

  // Large intestine (colon frame)
  const im = MAT.intestine();
  const colonPts = [
    v3(0.28,1.2,0.12), v3(0.3,1.0,0.14), v3(0.3,0.75,0.14), v3(0.28,0.5,0.14),
    v3(0.15,0.38,0.14), v3(0,0.36,0.14), v3(-0.15,0.38,0.14), v3(-0.28,0.5,0.14),
    v3(-0.3,0.75,0.14), v3(-0.3,1.0,0.14), v3(-0.28,1.22,0.12), v3(-0.1,1.28,0.12),
    v3(0.12,1.28,0.12)
  ];
  g.add(tube(colonPts, im, 0.045, 30));

  // Small intestine coils
  for (let i = 0; i < 10; i++) {
    const ang = i * 0.7;
    const r = 0.06 + (i % 3) * 0.04;
    const seg = tube([
      v3(r * Math.cos(ang) * 0.5, 0.82 - i * 0.04, 0.12 + r * Math.sin(ang) * 0.3),
      v3(r * Math.cos(ang + 1.2) * 0.5, 0.78 - i * 0.04, 0.14 + r * Math.sin(ang + 1.2) * 0.3),
    ], im, 0.025, 6);
    g.add(seg);
  }

  // Appendix
  g.add(tube([v3(0.28,1.05,0.14), v3(0.34,0.94,0.16), v3(0.32,0.86,0.18)], im, 0.016, 6));

  // Ureter + bladder
  const um = MAT.bladder();
  [-1,1].forEach(s => {
    g.add(tube([v3(0.2*s,1.26,-0.1), v3(0.18*s,0.9,0), v3(0.12*s,0.62,0.1), v3(0.06*s,0.52,0.14)], um, 0.012, 12));
  });
  const bladder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), um);
  bladder.scale.set(1, 1.1, 0.88); bladder.position.set(0, 0.48, 0.14); g.add(bladder);

  // Esophagus
  g.add(tube([v3(0,2.58,0.04), v3(0,2.2,0.04), v3(0,1.98,0.08), v3(-0.06,1.72,0.1)], stm, 0.022, 14));

  // Aortic bifurcation (connective tissue)
  const dm = new THREE.MeshPhongMaterial({ color: 0xeeeeee, shininess: 10, transparent: true, opacity: 0.35 });
  const diaphragm = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.04, 18), dm);
  diaphragm.position.set(0, 1.72, 0); g.add(diaphragm);
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function HumanBody3D({ activeSystems }) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    isDragging: false, prevMouse: { x: 0, y: 0 },
    rotY: 0, rotX: 0, zoom: 5.2, autoRotate: true, frameId: null,
  });
  const bodyRef = useRef(null);
  const systemsRef = useRef({});
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070e1a);
    scene.fog = new THREE.FogExp2(0x070e1a, 0.035);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0x334466, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 4); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6688cc, 0.45);
    fill.position.set(-4, 3, -2); scene.add(fill);
    const rim = new THREE.DirectionalLight(0x00ccff, 0.3);
    rim.position.set(0, 4, -5); scene.add(rim);
    const underLight = new THREE.PointLight(0x224488, 0.4, 12);
    underLight.position.set(0, -2, 1); scene.add(underLight);

    // Floor grid
    const grid = new THREE.GridHelper(12, 24, 0x112233, 0x0a1525);
    grid.position.y = -1.5; scene.add(grid);

    // Body group
    const bodyGroup = new THREE.Group();
    bodyRef.current = bodyGroup;
    scene.add(bodyGroup);

    const systems = {
      skeleton:    new THREE.Group(),
      muscles:     new THREE.Group(),
      circulatory: new THREE.Group(),
      nervous:     new THREE.Group(),
      organs:      new THREE.Group(),
    };
    buildSkeleton(systems.skeleton);
    buildMuscles(systems.muscles);
    buildCirculatory(systems.circulatory);
    buildNervous(systems.nervous);
    buildOrgans(systems.organs);

    Object.values(systems).forEach(s => bodyGroup.add(s));
    systemsRef.current = systems;

    const animate = () => {
      const st = stateRef.current;
      st.frameId = requestAnimationFrame(animate);

      if (st.autoRotate) st.rotY += 0.004;

      const cx = st.zoom * Math.sin(st.rotY) * Math.cos(st.rotX);
      const cy = 1.2 + st.zoom * Math.sin(st.rotX);
      const cz = st.zoom * Math.cos(st.rotY) * Math.cos(st.rotX);
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 1.1, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(stateRef.current.frameId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // Sync visibility
  useEffect(() => {
    Object.entries(systemsRef.current).forEach(([k, grp]) => {
      grp.visible = activeSystems.includes(k);
    });
  }, [activeSystems]);

  const onPointerDown = useCallback((e) => {
    stateRef.current.isDragging = true;
    stateRef.current.autoRotate = false;
    stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback((e) => {
    const st = stateRef.current;
    if (!st.isDragging) return;
    const dx = e.clientX - st.prevMouse.x;
    const dy = e.clientY - st.prevMouse.y;
    st.rotY += dx * 0.006;
    st.rotX = Math.max(-0.55, Math.min(0.9, st.rotX - dy * 0.005));
    st.prevMouse = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => { stateRef.current.isDragging = false; }, []);

  const onWheel = useCallback((e) => {
    stateRef.current.zoom = Math.max(2.2, Math.min(11, stateRef.current.zoom + e.deltaY * 0.006));
  }, []);

  const onDoubleClick = useCallback(() => {
    stateRef.current.autoRotate = !stateRef.current.autoRotate;
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
    />
  );
}