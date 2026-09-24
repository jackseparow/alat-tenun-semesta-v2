// ==========================================
// 1. BLOK ROTASI BIDANG (XY, XZ, YZ)
// ==========================================
Blockly.Blocks['transform_rotate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotasikan di bidang")
        .appendField(new Blockly.FieldDropdown([
          ["XY (Sumbu Z)", "XY"],
          ["XZ (Sumbu Y)", "XZ"],
          ["YZ (Sumbu X)", "YZ"]
        ]), "PLANE");
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("sebesar sudut");
    this.appendValueInput("PX")
        .setCheck("Number")
        .appendField("pusat X");
    this.appendValueInput("PY")
        .setCheck("Number")
        .appendField("Y");
    this.appendValueInput("PZ")
        .setCheck("Number")
        .appendField("Z");
    this.appendStatementInput("DO")
        .appendField("terhadap objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(38); // Warna Orange Transformasi
    this.setTooltip("Menerapkan rotasi pada bidang (XY, XZ, YZ) terhadap titik pusat tertentu.");
  }
};

javascript.javascriptGenerator.forBlock['transform_rotate'] = function(block, generator) {
  var plane = block.getFieldValue('PLANE');
  var angle = generator.valueToCode(block, 'ANGLE', javascript.Order.ATOMIC) || '0';
  var px = generator.valueToCode(block, 'PX', javascript.Order.ATOMIC) || '0';
  var py = generator.valueToCode(block, 'PY', javascript.Order.ATOMIC) || '0';
  var pz = generator.valueToCode(block, 'PZ', javascript.Order.ATOMIC) || '0';
  var statements_do = generator.statementToCode(block, 'DO');

  var code = `
(function() {
  var rad = (${angle}) * Math.PI / 180;
  var px = ${px}, py = ${py}, pz = ${pz};
  var plane = "${plane}";

  var tempGroup = new THREE.Group();
  sceneGroup.add(tempGroup);

  var subSceneGroup = tempGroup;
  (function(sceneGroup) {
    ${statements_do}
  })(subSceneGroup);

  tempGroup.children.forEach(function(child) {
    // Geser ke pusat rotasi
    child.position.x -= px;
    child.position.y -= py;
    child.position.z -= pz;

    // Terapkan rotasi sesuai bidang
    if (plane === 'XY') {
      child.rotation.z += rad;
    } else if (plane === 'XZ') {
      child.rotation.y += rad;
    } else if (plane === 'YZ') {
      child.rotation.x += rad;
    }

    // Kembalikan dari pusat rotasi
    var cosA = Math.cos(rad), sinA = Math.sin(rad);
    var rx = child.position.x, ry = child.position.y, rz = child.position.z;

    if (plane === 'XY') {
      child.position.x = rx * cosA - ry * sinA;
      child.position.y = rx * sinA + ry * cosA;
    } else if (plane === 'XZ') {
      child.position.x = rx * cosA + rz * sinA;
      child.position.z = -rx * sinA + rz * cosA;
    } else if (plane === 'YZ') {
      child.position.y = ry * cosA - rz * sinA;
      child.position.z = ry * sinA + rz * cosA;
    }

    child.position.x += px;
    child.position.y += py;
    child.position.z += pz;
  });

  while(tempGroup.children.length > 0) {
    sceneGroup.add(tempGroup.children[0]);
  }
  sceneGroup.remove(tempGroup);
})();
`;
  return code;
};


// ==========================================
// 2. BLOK ROTASI SUMBU GARIS BEBAS 3D
// ==========================================
Blockly.Blocks['transform_rotate_axis'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotasikan terhadap garis 3D");
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("sudut (derajat)");
    this.appendDummyInput()
        .appendField("Garis Titik 1 (X1, Y1, Z1):");
    this.appendValueInput("X1").setCheck("Number").appendField("X1");
    this.appendValueInput("Y1").setCheck("Number").appendField("Y1");
    this.appendValueInput("Z1").setCheck("Number").appendField("Z1");
    this.appendDummyInput()
        .appendField("Garis Titik 2 (X2, Y2, Z2):");
    this.appendValueInput("X2").setCheck("Number").appendField("X2");
    this.appendValueInput("Y2").setCheck("Number").appendField("Y2");
    this.appendValueInput("Z2").setCheck("Number").appendField("Z2");
    this.appendStatementInput("DO")
        .appendField("terhadap objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(38);
    this.setTooltip("Menerapkan rotasi objek terhadap sumbu putar berupa persamaan garis di ruang 3D.");
  }
};

javascript.javascriptGenerator.forBlock['transform_rotate_axis'] = function(block, generator) {
  var angle = generator.valueToCode(block, 'ANGLE', javascript.Order.ATOMIC) || '0';
  var x1 = generator.valueToCode(block, 'X1', javascript.Order.ATOMIC) || '0';
  var y1 = generator.valueToCode(block, 'Y1', javascript.Order.ATOMIC) || '0';
  var z1 = generator.valueToCode(block, 'Z1', javascript.Order.ATOMIC) || '0';
  var x2 = generator.valueToCode(block, 'X2', javascript.Order.ATOMIC) || '1';
  var y2 = generator.valueToCode(block, 'Y2', javascript.Order.ATOMIC) || '0';
  var z2 = generator.valueToCode(block, 'Z2', javascript.Order.ATOMIC) || '0';
  var statements_do = generator.statementToCode(block, 'DO');

  var code = `
(function() {
  var rad = (${angle}) * Math.PI / 180;
  var p1 = new THREE.Vector3(${x1}, ${y1}, ${z1});
  var p2 = new THREE.Vector3(${x2}, ${y2}, ${z2});
  var axis = new THREE.Vector3().subVectors(p2, p1).normalize();

  if (axis.length() === 0) axis.set(0, 0, 1); // fallback jika p1 == p2

  var tempGroup = new THREE.Group();
  sceneGroup.add(tempGroup);

  var subSceneGroup = tempGroup;
  (function(sceneGroup) {
    ${statements_do}
  })(subSceneGroup);

  tempGroup.children.forEach(function(child) {
    // Geser posisi ke titik acuan p1
    child.position.sub(p1);
    
    // Rotasikan posisi titik terhadap axis di p1
    child.position.applyAxisAngle(axis, rad);
    
    // Kembalikan posisi acuan
    child.position.add(p1);

    // Rotasikan orientasi lokal objek
    child.rotateOnWorldAxis(axis, rad);
  });

  while(tempGroup.children.length > 0) {
    sceneGroup.add(tempGroup.children[0]);
  }
  sceneGroup.remove(tempGroup);
})();
`;
  return code;
};
