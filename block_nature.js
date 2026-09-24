/**
 * ALAT TENUN SEMESTA - BUNDLE MODUL UTUH LENGKAP
 * (Elemen Alam Orientasi Z-Atas + Native Color Picker GeoBlock, Matematika Semesta, Pertumbuhan)
 * BBGTK DIY
 */

const jsGenNature = (typeof javascript !== 'undefined' && javascript.javascriptGenerator) ? javascript.javascriptGenerator : javascriptGenerator;

// ==========================================
// TEKNIK PALET WARNA VISUAL NATIVE GEOBLOCK
// ==========================================
function createNativeColorPickerField(defaultColor) {
  var field = new Blockly.FieldTextInput(defaultColor || '#e91e63');

  field.initView = function() {
    Blockly.FieldTextInput.prototype.initView.call(this);
    if (this.textElement_) {
      this.textElement_.style.display = 'none';
    }
  };

  field.showEditor_ = function() {
    var self = this;
    var picker = document.createElement('input');
    picker.type = 'color';
    picker.value = self.getValue() || '#e91e63';

    picker.addEventListener('input', function() {
      self.setValue(picker.value);
    });

    picker.click();
  };

  return field;
}

// ==========================================
// 1. KATEGORI ELEMEN ALAM (SUMBU Z = ATAS)
// ==========================================

// 1.1 Kelopak Bunga & Daun Organik
Blockly.Blocks['nature_petal'] = {
  init: function() {
    this.appendDummyInput().appendField("kelopak / daun");
    this.appendValueInput("LENGTH").setCheck("Number").appendField("panjang");
    this.appendValueInput("WIDTH").setCheck("Number").appendField("lebar");
    this.appendValueInput("CURVE").setCheck("Number").appendField("kelengkungan");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#E91E63");
    this.setTooltip("Membuat mahkota kelopak bunga atau daun 3D melengkung");
  }
};

jsGenNature.forBlock['nature_petal'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var len = gen.valueToCode(block, 'LENGTH', gen.ORDER_ATOMIC) || '15';
  var wid = gen.valueToCode(block, 'WIDTH', gen.ORDER_ATOMIC) || '6';
  var curve = gen.valueToCode(block, 'CURVE', gen.ORDER_ATOMIC) || '4';

  return `
(function() {
  const l = Number(${len});
  const w = Number(${wid});
  const c = Number(${curve});

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(w / 2, l / 2, 0, l);
  shape.quadraticCurveTo(-w / 2, l / 2, 0, 0);

  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i);
    let z = pos.getZ(i);
    pos.setZ(i, z + Math.sin((y / l) * Math.PI) * c);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 1.2 Biji & Node Spiral
Blockly.Blocks['nature_seed'] = {
  init: function() {
    this.appendDummyInput().appendField("biji / node");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("ukuran");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Membuat bulatan biji padat atau titik node kisi spiral");
  }
};

jsGenNature.forBlock['nature_seed'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var rad = gen.valueToCode(block, 'RADIUS', gen.ORDER_ATOMIC) || '1.5';

  return `
(function() {
  const r = Number(${rad});
  const geo = new THREE.SphereGeometry(r, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.4, metalness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 1.3 Batang & Ranting (Definisi Asli Berorientasi Sumbu Z ke Atas)
Blockly.Blocks['nature_stem'] = {
  init: function() {
    this.appendDummyInput().appendField("batang / ranting");
    this.appendValueInput("RADIUS_BOTTOM").setCheck("Number").appendField("r-bawah");
    this.appendValueInput("RADIUS_TOP").setCheck("Number").appendField("r-atas");
    this.appendValueInput("HEIGHT").setCheck("Number").appendField("tinggi (Z)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#795548");
    this.setTooltip("Membuat segmen silinder ranting/batang tumbuh tegak lurus ke atas (Sumbu Z)");
  }
};

jsGenNature.forBlock['nature_stem'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var rb = gen.valueToCode(block, 'RADIUS_BOTTOM', gen.ORDER_ATOMIC) || '2';
  var rt = gen.valueToCode(block, 'RADIUS_TOP', gen.ORDER_ATOMIC) || '1.5';
  var h = gen.valueToCode(block, 'HEIGHT', gen.ORDER_ATOMIC) || '10';

  return `
(function() {
  const rBottom = Number(${rb});
  const rTop = Number(${rt});
  const heightVal = Number(${h});

  // Membuat geometri silinder standar
  const geo = new THREE.CylinderGeometry(rTop, rBottom, heightVal, 12);

  // Mensejajarkan orientasi silinder dengan sumbu Z (atas) dan meletakkan pivot di pangkal (0,0,0)
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0, heightVal / 2);

  const mat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 1.4 Modul Belah Ketupat Origami (Miura-ori)
Blockly.Blocks['nature_origami_face'] = {
  init: function() {
    this.appendDummyInput().appendField("modul origami (belah ketupat)");
    this.appendValueInput("SIZE").setCheck("Number").appendField("panjang");
    this.appendValueInput("ANGLE").setCheck("Number").appendField("sudut buka (°)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9C27B0");
    this.setTooltip("Membuat permukaan lipatan belah ketupat origami untuk struktur mekar");
  }
};

jsGenNature.forBlock['nature_origami_face'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var size = gen.valueToCode(block, 'SIZE', gen.ORDER_ATOMIC) || '10';
  var angle = gen.valueToCode(block, 'ANGLE', gen.ORDER_ATOMIC) || '60';

  return `
(function() {
  const s = Number(${size});
  const rad = (Number(${angle}) * Math.PI) / 180;

  const shape = new THREE.Shape();
  const w = s * Math.sin(rad / 2);
  const h = s * Math.cos(rad / 2);

  shape.moveTo(0, h);
  shape.lineTo(w, 0);
  shape.lineTo(0, -h);
  shape.lineTo(-w, 0);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshStandardMaterial({ color: 0xab47bc, side: THREE.DoubleSide, roughness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 1.5 Segmen Cangkang Nautilus / Sulur
Blockly.Blocks['nature_shell_segment'] = {
  init: function() {
    this.appendDummyInput().appendField("segmen cangkang / sulur");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("radius");
    this.appendValueInput("TUBE").setCheck("Number").appendField("tebal pipa");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#009688");
    this.setTooltip("Membuat segmen lengkung torus untuk struktur cangkang nautilus");
  }
};

jsGenNature.forBlock['nature_shell_segment'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var r = gen.valueToCode(block, 'RADIUS', gen.ORDER_ATOMIC) || '8';
  var t = gen.valueToCode(block, 'TUBE', gen.ORDER_ATOMIC) || '2';

  return `
(function() {
  const radius = Number(${r});
  const tube = Number(${t});

  const geo = new THREE.TorusGeometry(radius, tube, 12, 24, Math.PI / 3);
  const mat = new THREE.MeshStandardMaterial({ color: 0x26a69a, roughness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 1.6 Titik Poros / Pivot Node
Blockly.Blocks['nature_pivot'] = {
  init: function() {
    this.appendDummyInput().appendField("titik poros (pivot)");
    this.appendValueInput("SIZE").setCheck("Number").appendField("ukuran penanda");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#3F51B5");
    this.setTooltip("Menandai titik poros koordinat lokal untuk acuan transformasi bercabang");
  }
};

jsGenNature.forBlock['nature_pivot'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var sz = gen.valueToCode(block, 'SIZE', gen.ORDER_ATOMIC) || '1';

  return `
(function() {
  const sizeVal = Number(${sz});
  const axes = new THREE.AxesHelper(sizeVal * 3);
  sceneGroup.add(axes);
})();
`;
};

// ==========================================
// 2. KATEGORI TRANSFORMASI (LAYOUT INLINE)
// ==========================================

// 2.1 BLOK TRANSLASI
Blockly.Blocks['transform_translate'] = {
  init: function() {
    this.appendDummyInput().appendField("translasi");
    this.appendValueInput("X").setCheck("Number").appendField("X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.appendValueInput("Z").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Menggeser posisi objek pada sumbu X, Y, dan Z");
  }
};

jsGenNature.forBlock['transform_translate'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var tx = gen.valueToCode(block, 'X', gen.ORDER_ATOMIC) || '0';
  var ty = gen.valueToCode(block, 'Y', gen.ORDER_ATOMIC) || '0';
  var tz = gen.valueToCode(block, 'Z', gen.ORDER_ATOMIC) || '0';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const posGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = posGroup;
  ${inner}
  sceneGroup = parent;
  posGroup.position.set(Number(${tx}), Number(${ty}), Number(${tz}));
  sceneGroup.add(posGroup);
})();
`;
};

// 2.2 BLOK DILATASI
Blockly.Blocks['transform_dilatation'] = {
  init: function() {
    this.appendDummyInput().appendField("dilatasi");
    this.appendValueInput("FACTOR").setCheck("Number").appendField("k");
    this.appendValueInput("PX").setCheck("Number").appendField("pusat X");
    this.appendValueInput("PY").setCheck("Number").appendField("Y");
    this.appendValueInput("PZ").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Melakukan dilatasi / perkalian skala terhadap titik pusat tertentu dengan faktor k");
  }
};

jsGenNature.forBlock['transform_dilatation'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var k = gen.valueToCode(block, 'FACTOR', gen.ORDER_ATOMIC) || '1';
  var px = gen.valueToCode(block, 'PX', gen.ORDER_ATOMIC) || '0';
  var py = gen.valueToCode(block, 'PY', gen.ORDER_ATOMIC) || '0';
  var pz = gen.valueToCode(block, 'PZ', gen.ORDER_ATOMIC) || '0';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const pGroup = new THREE.Group();
  const iGroup = new THREE.Group();
  
  const cx = Number(${px}), cy = Number(${py}), cz = Number(${pz});
  pGroup.position.set(cx, cy, cz);
  iGroup.position.set(-cx, -cy, -cz);
  
  pGroup.add(iGroup);

  const parent = sceneGroup;
  sceneGroup = iGroup;
  ${inner}
  sceneGroup = parent;

  const factor = Number(${k});
  pGroup.scale.set(factor, factor, factor);
  sceneGroup.add(pGroup);
})();
`;
};

// 2.3 BLOK ROTASI
Blockly.Blocks['transform_rotate'] = {
  init: function() {
    this.appendDummyInput().appendField("rotasi");
    this.appendValueInput("ANGLE_X").setCheck("Number").appendField("sudut X");
    this.appendValueInput("ANGLE_Y").setCheck("Number").appendField("Y");
    this.appendValueInput("ANGLE_Z").setCheck("Number").appendField("Z");
    this.appendValueInput("PX").setCheck("Number").appendField("pusat X");
    this.appendValueInput("PY").setCheck("Number").appendField("Y");
    this.appendValueInput("PZ").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Memutar objek sebesar sudut (X, Y, Z) terhadap titik pusat koordinat tertentu");
  }
};

jsGenNature.forBlock['transform_rotate'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var ax = gen.valueToCode(block, 'ANGLE_X', gen.ORDER_ATOMIC) || '0';
  var ay = gen.valueToCode(block, 'ANGLE_Y', gen.ORDER_ATOMIC) || '0';
  var az = gen.valueToCode(block, 'ANGLE_Z', gen.ORDER_ATOMIC) || '0';
  var px = gen.valueToCode(block, 'PX', gen.ORDER_ATOMIC) || '0';
  var py = gen.valueToCode(block, 'PY', gen.ORDER_ATOMIC) || '0';
  var pz = gen.valueToCode(block, 'PZ', gen.ORDER_ATOMIC) || '0';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const pivotGroup = new THREE.Group();
  const innerGroup = new THREE.Group();
  
  const cx = Number(${px}), cy = Number(${py}), cz = Number(${pz});
  pivotGroup.position.set(cx, cy, cz);
  innerGroup.position.set(-cx, -cy, -cz);
  
  pivotGroup.add(innerGroup);

  const parent = sceneGroup;
  sceneGroup = innerGroup;
  ${inner}
  sceneGroup = parent;

  pivotGroup.rotation.x = (Number(${ax}) * Math.PI) / 180;
  pivotGroup.rotation.y = (Number(${ay}) * Math.PI) / 180;
  pivotGroup.rotation.z = (Number(${az}) * Math.PI) / 180;

  sceneGroup.add(pivotGroup);
})();
`;
};

// 2.4 BLOK TRANSFORMASI WARNA (NATIVE COLOR PICKER GEOBLOCK)
Blockly.Blocks['transform_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ubah warna")
        .appendField(createNativeColorPickerField("#e91e63"), "COLOR");

    this.appendStatementInput("STACK").appendField("objek");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Klik untuk memilih warna dari palet warna visual");
  }
};

jsGenNature.forBlock['transform_color'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var hex = block.getFieldValue('COLOR') || "#e91e63";
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const colorGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = colorGroup;
  ${inner}
  sceneGroup = parent;
  colorGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
      child.material.color.setStyle("${hex}");
    }
  });
  sceneGroup.add(colorGroup);
})();
`;
};

// ==========================================
// 3. KATEGORI MATEMATIKA SEMESTA
// ==========================================

// 3.1 Input Sudut Tunggal (Satuan Derajat °)
Blockly.Blocks['nature_angle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("sudut")
        .appendField(new Blockly.FieldNumber(45, -360, 360), "ANGLE")
        .appendField("°");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Input nilai sudut dalam satuan derajat (°)");
  }
};

jsGenNature.forBlock['nature_angle'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var angleVal = block.getFieldValue('ANGLE') || '0';
  return [angleVal, gen.ORDER_ATOMIC];
};

// 3.2 Sudut Keemasan (Golden Angle 137.5°)
Blockly.Blocks['nature_golden_angle'] = {
  init: function() {
    this.appendDummyInput().appendField("Sudut Keemasan (137.5°)");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Konstanta rasio penataan alami (Golden Angle = 137.5 derajat)");
  }
};

jsGenNature.forBlock['nature_golden_angle'] = function(block, generator) {
  var gen = generator || jsGenNature;
  return ['137.5', gen.ORDER_ATOMIC];
};

// 3.3 Rasio Emas Phi (1.618)
Blockly.Blocks['nature_phi_ratio'] = {
  init: function() {
    this.appendDummyInput().appendField("Rasio Emas Phi (1.618)");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Rasio Keemasan / Golden Ratio (1.618033...)");
  }
};

jsGenNature.forBlock['nature_phi_ratio'] = function(block, generator) {
  var gen = generator || jsGenNature;
  return ['1.61803398875', gen.ORDER_ATOMIC];
};

// 3.4 Deret Fibonacci (Suku ke-n)
Blockly.Blocks['nature_fibonacci'] = {
  init: function() {
    this.appendValueInput("N")
        .setCheck("Number")
        .appendField("Fibonacci suku ke-");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Menghitung nilai suku ke-n pada deret Fibonacci (1, 1, 2, 3, 5, 8, 13...)");
  }
};

jsGenNature.forBlock['nature_fibonacci'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var nVal = gen.valueToCode(block, 'N', gen.ORDER_ATOMIC) || '1';
  
  var code = `(function(n) {
    let a = 0, b = 1;
    for (let i = 0; i < Math.floor(n); i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return a;
  })(${nVal})`;
  
  return [code, gen.ORDER_ATOMIC];
};

// 3.5 Konversi Derajat ke Radian
Blockly.Blocks['nature_deg_to_rad'] = {
  init: function() {
    this.appendValueInput("DEG")
        .setCheck("Number")
        .appendField("konversi")
        .appendField("derajat ke rad");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Mengubah sudut derajat menjadi nilai Radian");
  }
};

jsGenNature.forBlock['nature_deg_to_rad'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var deg = gen.valueToCode(block, 'DEG', gen.ORDER_ATOMIC) || '0';
  return [`((${deg}) * Math.PI / 180)`, gen.ORDER_ATOMIC];
};

// 3.6 Modulo (Sisa Bagi)
Blockly.Blocks['nature_modulo'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("modulo");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Menghitung sisa hasil pembagian (modulo) A % B");
  }
};

jsGenNature.forBlock['nature_modulo'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var div = gen.valueToCode(block, 'DIVIDEND', gen.ORDER_ATOMIC) || '0';
  var sor = gen.valueToCode(block, 'DIVISOR', gen.ORDER_ATOMIC) || '1';
  return [`((${div}) % (${sor}))`, gen.ORDER_ATOMIC];
};
