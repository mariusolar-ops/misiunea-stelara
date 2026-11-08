// Decorul fiecărei teme (doar de privit, nu se atinge).
import * as THREE from 'three';

export type Tema = 'luna';

export function creeazaDecor(tema: Tema): THREE.Object3D {
  const grup = new THREE.Group();
  if (tema === 'luna') {
    // O lună uriașă, gri, departe sub platforme – „baza” e pe orbita ei
    const luna = new THREE.Mesh(
      new THREE.SphereGeometry(220, 32, 20),
      new THREE.MeshLambertMaterial({ color: 0x9a9fb3, flatShading: true }),
    );
    luna.position.set(0, -265, -40);
    grup.add(luna);
    // cratere: discuri mai închise pe suprafața lunii
    const matCrater = new THREE.MeshLambertMaterial({ color: 0x6d7287 });
    for (let i = 0; i < 14; i++) {
      const r = 6 + Math.random() * 14;
      const crater = new THREE.Mesh(new THREE.CircleGeometry(r, 14), matCrater);
      // punct la întâmplare pe partea de sus a lunii
      const u = 0.75 + Math.random() * 0.25, t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const n = new THREE.Vector3(s * Math.cos(t), u, s * Math.sin(t));
      crater.position.copy(luna.position).addScaledVector(n, 220.5);
      crater.lookAt(crater.position.clone().add(n));
      grup.add(crater);
    }
  }
  return grup;
}
