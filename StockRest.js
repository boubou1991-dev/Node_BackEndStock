const mysql= require('mysql');
const express=require('express');
var app=express();
const bodyparser=require('body-parser');

app.use(bodyparser.json());

app.use(function(req,res,next){
    res.setHeader("Access-control-Allow-Origin","*");
    
    res.header("Access-control-Allow-Methods","POST","GET","PUT","OPTIONS","delete");

    res.header("Access-Control-Max-Age","3600");

    res.header("Access-Control-Allow-Headers","Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-with")
     
    next();

});


var mysqlConnection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'database_stock',
   multipleStatements:true
});

mysqlConnection.connect((err)=>{
if(!err)
console.log('Connection avec succes.');
else
console.log('Erreur de Connexion.\n Error:'+JSON.stringify(err,undefined,2));
});

app.listen(2000,()=>console.log('Express Server est demarre sur le port 2000'));

// Retour tout les Produits  getAllProduct
app.get('/produits',(req,res)=>{
    let sql='Select * from tb_produit order by nomProduit ASC';
mysqlConnection.query(sql,(err,rows,fields)=>{
    if(!err)
   // console.log(rows);
    res.send(rows);
    else
    console.log(err);
})
});

app.get('/stock',(req,res)=>{
    mysqlConnection.query('Select * from tb_produit order by nomProduit ASC',(err,rows,fields)=>{
        if(!err)
       // console.log(rows);
        res.send(rows);
        else
        console.log(err);
    })
    });

    app.get('/operationDetails/:nom',(req,res)=>{
        let sql='select * from tb_historiquecompte where unites like ? order by idhistocompte DESC';
        mysqlConnection.query(sql,[req.params.nom],(err,rows)=>{
            if(err) throw err;
            res.send(rows);
        })
    })
    

app.get('/users',(req,res)=>{
    mysqlConnection.query('Select * from tb_utilisateur order by login asc',(err,rows,fields)=>{
        if(!err)
       // console.log(rows);
        res.send(rows);
        else
        console.log(err);
    })
    });
    
    app.post('/insertUtilisateur',(req,res)=>{
    var data=JSON.parse(req.body.data);
    var prenom=data.prenom;
    var login=data.login;
    var pwd=data.pwd;
    var type= data.type;
    mysqlConnection.connect(()=>{
        var query="insert into tb_utilisateur (prenom,login,pwd,type) values('"+prenom+"','"+login+"','"+pwd+"','"+type+"')";
        mysqlConnection.query(query,(err,result,field)=>{
            if(err){
                   res.end(JSON.stringify(err));
            }else{
                if(result.affectedRows > 0){
                    res.end("successfully inserted");
                }
                else{
                    res.end("Please try again");
                }
            }
        })
    })
});

app.get('/insertProduct/:nomProduit/:quantite/:Serie/:dateInsertion/:idMarque/:Type',(req,res)=>{
let produit={
    nomProduit:`${req.params.nomProduit}`,
    quantite:`${req.params.quantite}`,
    Serie:`${req.params.Serie}`,
    dateInsertion:`${req.params.dateInsertion}`,
    idMarque:'1',
    Type:`${req.params.Type}` 
};
let sql="INSERT INTO tb_produit set ?";
let query=mysqlConnection.query(sql,produit,(err,result)=>{
    if(err) throw err;
    res.send('Produit inséré...')
}) ;
});

app.get('/insertFournisseur/:nomFournisseur/:pays',(req,res)=>{
let fournisseur={
    nomFournisseur:`${req.params.nomFournisseur}`,
    pays          :`${req.params.pays}`
};
let requeteInsert='insert INTO tb_fournisseur set ?';
let query=mysqlConnection.query(requeteInsert,fournisseur,(err,rows)=>{
    if(err) throw err;
    res.send("Fournisseur Inséré...")
})
});

app.get('/InsertOP/:action/:user/:iduser/:date/:mois/:periode/:ref/:libelle/:depot/:retrait/:solde/:unites/:operation/:imei/:produitid',(req,res)=>{
    let newOperation={
    action:`${req.params.action}`,
    user:`${req.params.user}`,
    iduser:`${req.params.iduser}`,
    date:`${req.params.date}`,
    mois:`${req.params.mois}`,
    periode:`${req.params.periode}`,
    ref:`${req.params.ref}`,
    libelle:`${req.params.libelle}`,
    depot:`${req.params.depot}`,
    retrait:`${req.params.retrait}`,
    solde:`${req.params.solde}`,
    unites:`${req.params.unites}`,
    operation:`${req.params.operation}`,
    imei:`${req.params.imei}`,
    produitid:`${req.params.produitid}`
};
    let sql='INSERT INTO tb_historiquecompte SET ?';
    let query=mysqlConnection.query(sql,newOperation,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Post 1 added....');
    });
});


app.delete('/users/:id',(req,res)=>{
    mysqlConnection.query('delete from tb_utilisateur where iduser=?',[req.params.id],(err,rows,fields)=>{
        if(!err)
        res.send('Supprimer avec success');
        else
        console.log(err);
    })
    });

app.get('/deleteUser/:id',(req,res)=>{
    let sql=`delete from tb_utilisateur where iduser=${req.params.id}`;
    let query=mysqlConnection.query(sql,(err,result)=>{
        if(err) throw err;
    console.log(result);
    })
});

app.get("/deleteFournisseur/:id",(req,res)=>{
let sql=`delete from tb_fournisseur where idFournisseur=${req.params.id}`;
let query=mysqlConnection.query(sql,(err,result)=>{
    if(!err)
    console.log(result);
    else
   console.log(err);
})
})

app.get('/updateUser/:id/:prenom/:login/:pwd/:type',(req,res)=>{
    let sql=`update tb_utilisateur set prenom='${req.params.prenom}', login='${req.params.login}'
    ,pwd='${req.params.pwd}',type='${req.params.type}'
    where iduser=${req.params.id}`;
    let query=mysqlConnection.query(sql,(err,result)=>{
        if(!err)
        console.log(result);
        res.send('utilisateur updated...');
        
    });
});
    
app.get("/updateFournisseur/:id/:nomFournisseur/:pays",(req,res)=>{
let sql=`update tb_fournisseur set nomFournisseur='${req.params.nomFournisseur}',pays='${req.params.pays}'
where idFournisseur=${req.params.id}`;
let query=mysqlConnection.query(sql,(err,result)=>{
    if(!err)
    console.log(result);
    res.send('Fournisseur Mis à jour...');

})
});

app.put('/updateUtilisateur',(req,res)=>{
    var data=JSON.parse(req.body.data);
    var iduser=data.iduser;
    var prenom=data.prenom;
    var login=data.login;
    var pwd=data.pwd;
    var type= data.type;
    mysqlConnection.connect(function(){
        var query="update tb_utilisateur set prenom='"+prenom+"', login='"+login+"',pwd='"+pwd+"', type='"+type+"' where iduser="+iduser+" ";
    
        mysqlConnection.query(query,function(err,result,field){
            if(err){
                   res.end(JSON.stringify(err));
            }else{
                if(result.affectedRows > 0){
                    res.end("successfully inserted");
                }
                else{
                    res.end("Please try again");
                }
            }
        })
    })
})

app.get('/categories',(req,res)=>{
    mysqlConnection.query('select * from tb_categorie order by nomCategorie asc',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
})

app.get('/fournisseur',(req,res)=>{
    mysqlConnection.query('select * from tb_fournisseur order by nomFournisseur asc',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
})

// Retour de toutes les operations
app.get('/operations',(req,res)=>{
    mysqlConnection.query('select * from tb_historiquecompte order by idhistocompte DESC',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
    console.log(err)
    })
});

app.get('/operationDetails/:nom',(req,res)=>{
    mysqlConnection.query('select * from tb_historiquecompte where unites like ? order by idhistocompte DESC',[req.params.nom],(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
    console.log(err)
    })
})

// get an Produit
app.get('/produits/:id',(req,res)=>{
mysqlConnection.query('select * from tb_produit where nomProduit=? ',[req.params.id],(err,rows,fields)=>{
    if(!err)
    res.send(rows);
    else
    console.log(err);
})
});

//Update quantite

app.get('/updateQuantity/:name/:quantity',(req,res)=>{
    let sql=`update tb_produit set quantite=${req.params.quantity} where nomProduit like '${req.params.name}'`;
   let query= mysqlConnection.query(sql,(err,result)=>{
        if(!err)
        res.send(result);
        else 
        console.log(err);
    })
})

//Delete an Employee
app.get('/DeleteProduits/:id',(req,res)=>{
    let sql=`delete from tb_produit where idproduit=${req.params.id}`;
    let query=mysqlConnection.query(sql,(err,result)=>{
        if(err) throw err;
    console.log(result);
    })
});
