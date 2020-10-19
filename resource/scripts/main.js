display.fps=10+(display.grid.width+display.grid.height)*2;
function generateGrid(){
	document.getElementById("grid").innerHTML="";
	let new_tile_ID=0;
	for(let new_row_num=0;new_row_num<display.grid.height;new_row_num++){
		let new_row=document.createElement("div");
		new_row.className="row";
		for(let new_tile_num=0;new_tile_num<display.grid.width;new_tile_num++){
			let new_tile=document.createElement("div");
			new_tile.className="tile";
			new_tile.id=new_tile_ID.toString();
			new_tile.onmousedown=function(){
				let tile_row=Math.floor(this.id/display.grid.width);
				let world_tile=player.position+(world.width*(tile_row-Math.floor(display.grid.height/2)))+(this.id-tile_row*display.grid.width)-Math.floor(display.grid.width/2);
				//world.terrain[player.position+(world.width*(tile_row-Math.floor(display.grid.height/2)))+(this.id-tile_row*display.grid.width)-Math.floor(display.grid.width/2)]=2;
				if((world.terrain[world_tile]!=0)&&(world.terrain[world_tile]!=11)){
					if(world.terrain[world_tile]==1){
						world.terrain[world_tile]=player.inventory;
						player.inventory=1;
					}
					else{
						if(player.inventory==1){
							player.inventory=world.terrain[world_tile];
							world.terrain[world_tile]=1;
						}
					}
				}
				displayInventory();
				displayWorld();
			};
			new_tile.style.width=display.grid.item.width;
			new_tile.style.height=display.grid.item.height;
			new_row.appendChild(new_tile);
			new_tile_ID++;
		}
		document.getElementById("grid").appendChild(new_row);
	}
}
function generateTerrain(){
	setBiome();
	for(world.terrain=[];world.terrain.length<world.width*world.height;world.terrain.push(1)){
		world.link.push(document.getElementById(world.terrain.length));
	}
	world.terrain_height*=world.height;
	world.terrain_height_offset*=world.height;
	let tile_column_height=world.terrain_height+Math.floor(Math.random()*world.terrain_height_offset)-world.terrain_height_offset/2;
	for(let tile_column_num=0;tile_column_num<world.width;tile_column_num++){
		world.biomes[world.biome].layer_offset+=Math.floor(Math.random()*5)-2;
		for(let layer_number=0;layer_number<world.biomes[world.biome].layers.length;layer_number++){
			for(let tile_column_height_num=0;tile_column_height_num<world.biomes[world.biome].layers[layer_number].size+world.biomes[world.biome].layer_offset+Math.floor(Math.random()*world.biomes[world.biome].layer_offset);tile_column_height_num++){
				world.terrain[world.width*(world.height-tile_column_height_num-1)+tile_column_num]=world.biomes[world.biome].layers[layer_number].tile;
			}
		}
	}
	if(world.terrain_smooth){
		for(let tile_check_num=0;tile_check_num<world.terrain.length;tile_check_num++){
			if((world.terrain[tile_check_num]!=1)&&(world.terrain[tile_check_num-1]==1)&&(world.terrain[tile_check_num+1]==1)){
				world.terrain[tile_check_num]=1;
			}
			if((world.terrain[tile_check_num]==1)&&(world.terrain[tile_check_num+1]!=1)&&(world.terrain[tile_check_num+2]!=1)&&(world.terrain[tile_check_num+3]==1)){
				world.terrain[tile_check_num+1]=1;
				world.terrain[tile_check_num+2]=1;
			}
			if((world.terrain[tile_check_num]==4)&&(world.terrain[tile_check_num-world.width]==1)){
				world .terrain[tile_check_num]=10;
			}
			if((world.terrain[tile_check_num]==10)&&(world.terrain[tile_check_num-world.width]!=1)){
				world.terrain[tile_check_num]=4;
			}
			if((world.terrain[tile_check_num]!=1)&&(world.terrain[tile_check_num+world.width+1]==1)){
				world.terrain[tile_check_num+world.width+1]=world.biomes[world.biome].layers[0].tile;
			}
			if((world.terrain[tile_check_num]!=1)&&(world.terrain[tile_check_num+world.width-1]==1)){
				world.terrain[tile_check_num+world.width-1]=world.biomes[world.biome].layers[0].tile;
			}
			if((world.terrain[tile_check_num]==10)&&(Math.floor(Math.random()*world.tree.rarity)==1)){
				world.terrain[tile_check_num-world.width]=6;
				for(let tree_height=2;tree_height<Math.floor(Math.random()*world.tree.variation)+world.tree.height;tree_height++){
					world.terrain[tile_check_num-(world.width*tree_height)]=Math.floor(Math.random()*4)+12;
				}
			}
		}
	}
	if(world.spawn_ores){
		for(let tile_check_num=3;tile_check_num<world.terrain.length;tile_check_num++){
			if((world.terrain[tile_check_num]==3)&&(Math.floor(Math.random()*tile[16].properties.rarity)==1)){
				world.terrain[tile_check_num]=16;
			}
		}
	}
	for(let wall_layer=0;wall_layer<Math.floor(display.grid.width/2);wall_layer++){
		for(let wall_tile_num=0;wall_tile_num<world.terrain.length;wall_tile_num+=world.width){
			world.terrain[wall_tile_num+wall_layer]=0;
			world.terrain[wall_tile_num+world.width-1-wall_layer]=0;
		}
	}
	for(let wall_layer=0;wall_layer<Math.floor(display.grid.height/2);wall_layer++){
		for(let wall_tile_num=0;wall_tile_num<world.width;wall_tile_num++){
			world.terrain[wall_tile_num+world.width*wall_layer]=0;
			world.terrain[wall_tile_num+world.width*(world.height-(wall_layer+1))]=0;
		}
	}
	while(world.terrain[player.position+world.width]==1){
		player.position+=world.width;
	}
	world.terrain[player.position]=11;
}
function displayWorld(){
	let display_num=0;
	for(let display_height=Math.floor(display.grid.height/2)*-1;display_height<Math.ceil(display.grid.height/2);display_height++){
		for(let display_width=Math.floor(display.grid.width/2)*-1;display_width<Math.ceil(display.grid.width/2);display_width++){
			document.getElementById(display_num.toString()).innerHTML="<img src=\""+tile[world.terrain[player.position+(display_height*world.width)+display_width]].image[0]+"\" width=\""+display.grid.item.width+"\" height=\""+display.grid.item.height+"\" draggable=false>";
			display_num++;
		}
	}
}
let fallCoolDown=1000/display.fps;
let moveCoolDown=1000/display.fps/2;
document.onkeydown=function(event){
	switch(event.keyCode){
		case 87:
			if(moveCoolDown<0){
				if((tile[world.terrain[player.position-world.width]].properties.movable)&&((tile[world.terrain[player.position+world.width]].properties.movable==false)||(tile[world.terrain[player.position+world.width]].properties.liquid))){
					world.terrain[player.position]=world.terrain[player.position-world.width];
					world.terrain[player.position-world.width]=11;
					player.position-=world.width;
					moveCoolDown=1000/display.fps/2;
				}
			}
			break;
		case 65:
			if(moveCoolDown<0){
				if(tile[world.terrain[player.position-1]].properties.movable){
					world.terrain[player.position]=world.terrain[player.position-1];
					world.terrain[player.position-1]=11;
					player.position--;
					moveCoolDown=1000/display.fps/2;
				}
				else{
					if((tile[world.terrain[player.position-world.width-1]].properties.movable)&&(tile[world.terrain[player.position-world.width]].properties.movable)){
						world.terrain[player.position]=world.terrain[player.position-world.width-1];
						world.terrain[player.position-1-world.width]=11;
						player.position-=(world.width+1);
						moveCoolDown=1000/display.fps/2;
					}
				}
			}
			break;
		case 68:
			if(moveCoolDown<0){
				if(tile[world.terrain[player.position+1]].properties.movable){
					world.terrain[player.position]=world.terrain[player.position+1];
					world.terrain[player.position+1]=11;
					player.position++;
					moveCoolDown=1000/display.fps/2;
				}
				else{
					if((tile[world.terrain[player.position-world.width+1]].properties.movable)&&(tile[world.terrain[player.position-world.width]].properties.movable)){
						world.terrain[player.position]=world.terrain[player.position-world.width+1];
						world.terrain[player.position+1-world.width]=11;
						player.position-=world.width-1;
						moveCoolDown=1000/display.fps/2;
					}
				}
			}
			break;
	}
	displayWorld();
}
setInterval(function(){
	fallCoolDown--;
	moveCoolDown--;
	if(fallCoolDown<0){
		if(tile[world.terrain[player.position+world.width]].properties.movable){
			world.terrain[player.position]=world.terrain[player.position+world.width];
			world.terrain[player.position+world.width]=11;
			player.position+=world.width;
		}
		if(tile[world.terrain[player.position-world.width]].properties.liquid){
			world.terrain[player.position]=world.terrain[player.position-world.width];
			world.terrain[player.position-world.width]=11;
			player.position-=world.width;
		}
		moveTiles();
		updateMovedTiles();
		fallCoolDown=1000/display.fps;
	}
	displayWorld();
},1);
function displayInventory(){
	if(player.inventory==1){
		document.getElementById("inventory_tile").innerHTML="";
		document.getElementById("inventory_name").innerHTML="";
	}
	else{
		document.getElementById("inventory_tile").innerHTML="<img src=\""+tile[player.inventory].image[1]+"\" width=\""+display.grid.item.width+"\" height=\""+display.grid.item.height+"\" draggable=false>";
		document.getElementById("inventory_name").innerHTML=tile[player.inventory].properties.id;
	}
}
function setBiome(){
	let biome_list=[];
	for(let biome_num=0;biome_num<world.biomes.length;biome_num++){
		for(let biome_chance=0;biome_chance<world.biomes[biome_num].chance;biome_chance++){
			biome_list.push(biome_num);
		}
	}
	world.biome=biome_list[Math.floor(Math.random()*biome_list.length)];
}
generateGrid();
generateTerrain();
displayWorld();
displayInventory();


function moveTiles(){
	let moving_tile=1;
	for(let moving_tile_num=0;moving_tile_num<world.terrain.length;moving_tile_num++){
		if(tile[world.terrain[moving_tile_num]].properties.gravity){
			if(tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num+world.width])){
				moving_tile=world.terrain[moving_tile_num];
				world.terrain[moving_tile_num]=world.terrain[moving_tile_num+world.width];
				if(moving_tile==5){
					world.terrain[moving_tile_num+world.width]=17;
				}
				if(moving_tile==9){
					world.terrain[moving_tile_num+world.width]=18;
				}
			}
		}
		if(tile[world.terrain[moving_tile_num]].properties.liquid){
			if(tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num+world.width])){
				switch(world.terrain[moving_tile_num]){
					case 2:
						world.terrain[moving_tile_num]=world.terrain[moving_tile_num+world.width];
						world.terrain[moving_tile_num+world.width]=19;
						break;
				}
			}
			if((tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num+1]))&&(tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num-1]))){
				if(Math.floor(Math.random()*2)==1){
					switch(world.terrain[moving_tile_num]){
						case 2:
							world.terrain[moving_tile_num]=world.terrain[moving_tile_num+1];
							world.terrain[moving_tile_num+1]=19;
							break;
					}
				}
				else{
					switch(world.terrain[moving_tile_num]){
						case 2:
							world.terrain[moving_tile_num]=world.terrain[moving_tile_num-1];
							world.terrain[moving_tile_num-1]=19;
							break;
					}
				}
			}
			else{
				if(tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num+1])){
					switch(world.terrain[moving_tile_num]){
						case 2:
							world.terrain[moving_tile_num]=world.terrain[moving_tile_num+1];
							world.terrain[moving_tile_num+1]=19;
							break;
					}
				}
				if(tile[world.terrain[moving_tile_num]].properties.misplace.includes(world.terrain[moving_tile_num-1])){
					switch(world.terrain[moving_tile_num]){
						case 2:
							world.terrain[moving_tile_num]=world.terrain[moving_tile_num-1];
							world.terrain[moving_tile_num-1]=19;
							break;
					}
				}
			}
		}
	}
}
function updateMovedTiles(){
	for(let updating_tile=0;updating_tile<world.terrain.length;updating_tile++){
		switch(world.terrain[updating_tile]){
			case 17:
				world.terrain[updating_tile]=5;
				break;
			case 18:
				world.terrain[updating_tile]=9;
				break;
			case 19:
				world.terrain[updating_tile]=2;
		}
	}
}