// Particule: cubulețe mici care zboară și se micșorează până dispar.
// Toate (până la 300) se desenează dintr-o singură bucată (InstancedMesh) – foarte ieftin pentru telefon.
// Le folosim pentru urmele din spatele personajului, crater, confetti etc.
// Tot aici sunt „inelele” plate (crater, undă de șoc) care se lărgesc și se sting.
import * as THREE from 'three';

const MAX = 300;
const NR_INELE = 4;

interface Particula {
  viata: number;      // cât mai trăiește (secunde)
  viataMax: number;
  poz: THREE.Vector3;
  viteza: THREE.Vector3;
  marime: number;
  gravitatie: number;
}

interface Inel {
  mesh: THREE.Mesh;
  viata: number;
  viataMax: number;
  razaDe: number;
  razaLa: number;
  opacitate: number;
}

export class Particule {
  obiect = new THREE.Group();
  private mesh: THREE.InstancedMesh;
  private lista: Particula[] = [];
  private urmatoarea = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3();
  private inele: Inel[] = [];
  private urmatorulInel = 0;

  constructor(scena: THREE.Scene) {
    this.mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    for (let i = 0; i < MAX; i++) {
      this.lista.push({ viata: 0, viataMax: 1, poz: new THREE.Vector3(), viteza: new THREE.Vector3(), marime: 0, gravitatie: 0 });
      this.mesh.setMatrixAt(i, this.m.makeScale(0, 0, 0));
      this.mesh.setColorAt(i, new THREE.Color(0xffffff));
    }
    this.obiect.add(this.mesh);
    // inelele plate
    const forma = new THREE.RingGeometry(0.75, 1, 28).rotateX(-Math.PI / 2);
    for (let i = 0; i < NR_INELE; i++) {
      const mesh = new THREE.Mesh(forma, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      mesh.visible = false;
      this.inele.push({ mesh, viata: 0, viataMax: 1, razaDe: 1, razaLa: 1, opacitate: 1 });
      this.obiect.add(mesh);
    }
    scena.add(this.obiect);
  }

  /** Lansează o particulă */
  emite(poz: THREE.Vector3, viteza: THREE.Vector3, culoare: THREE.ColorRepresentation, viata = 0.8, marime = 0.15, gravitatie = 0) {
    const i = this.urmatoarea;
    this.urmatoarea = (this.urmatoarea + 1) % MAX;
    const p = this.lista[i];
    p.poz.copy(poz); p.viteza.copy(viteza);
    p.viata = p.viataMax = viata; p.marime = marime; p.gravitatie = gravitatie;
    this.mesh.setColorAt(i, new THREE.Color(culoare));
    this.mesh.instanceColor!.needsUpdate = true;
  }

  /** O „explozie” de particule în toate direcțiile (în sus) */
  explozie(poz: THREE.Vector3, nr: number, culori: THREE.ColorRepresentation[], forta = 5, marime = 0.18, gravitatie = 14, viata = 0.9) {
    const v = new THREE.Vector3();
    for (let k = 0; k < nr; k++) {
      const u = Math.random() * Math.PI * 2, r = forta * (0.4 + Math.random() * 0.6);
      v.set(Math.cos(u) * r, forta * (0.6 + Math.random() * 0.8), Math.sin(u) * r);
      this.emite(poz, v, culori[k % culori.length], viata * (0.7 + Math.random() * 0.6), marime, gravitatie);
    }
  }

  /** Un inel plat pe sol care se lărgește și se stinge */
  inel(poz: THREE.Vector3, culoare: THREE.ColorRepresentation, razaDe: number, razaLa: number, viata: number, opacitate = 0.8) {
    const inel = this.inele[this.urmatorulInel];
    this.urmatorulInel = (this.urmatorulInel + 1) % NR_INELE;
    inel.mesh.position.copy(poz);
    (inel.mesh.material as THREE.MeshBasicMaterial).color.set(culoare);
    Object.assign(inel, { viata, viataMax: viata, razaDe, razaLa, opacitate });
    inel.mesh.visible = true;
  }

  actualizeaza(dt: number) {
    for (let i = 0; i < MAX; i++) {
      const p = this.lista[i];
      if (p.viata <= 0) continue;
      p.viata -= dt;
      p.viteza.y -= p.gravitatie * dt;
      p.poz.addScaledVector(p.viteza, dt);
      const k = Math.max(0, p.viata / p.viataMax);
      this.s.setScalar(p.marime * k);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, p.viata * 4);
      this.mesh.setMatrixAt(i, this.m.compose(p.poz, this.q, this.s));
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    for (const inel of this.inele) {
      if (!inel.mesh.visible) continue;
      inel.viata -= dt;
      if (inel.viata <= 0) { inel.mesh.visible = false; continue; }
      const k = 1 - inel.viata / inel.viataMax;
      inel.mesh.scale.setScalar(inel.razaDe + (inel.razaLa - inel.razaDe) * Math.sqrt(k));
      (inel.mesh.material as THREE.MeshBasicMaterial).opacity = inel.opacitate * (1 - k);
    }
  }
}
