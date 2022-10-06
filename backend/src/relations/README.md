### Relation readme

# description
Relation folder est l'ensemble des outils liee aux relation entre 2 Useur
On y trouve les fonctions pour ajouter ses amis, blocker des gens, afficher une list d'ami, et plein d'autre.

#### Path /relation/ 
- 1. add_friend : update/creer une relation friend entre meId et userId 
- 2. remove_friend: retir la relation friend entre meId et userId
- 3. block_user : update/creer une relation pour que meId block userId  
- 4. unblock_user : update une relation pour que meId unblock une relation
- 5. list_friend : affiche la list d'amis de meId
- 6. list_block : affiche la list des user block de meId

## 1. add_friend /add_friend
Requete Post prenant un Body {userId : number} et un Authorization Bearer : token

Ajoute un user en ami, si la relation exist : 
-si deja amis no update, 
-sinon update relation.relation === 1,
si relation n'existe pas, je la creer.
fonction protege contre userId et meId invalide

## 2. remove_friend /remove_friend
Requete Post prenant un Body {userId : number} et un Authorization Bearer : token

Retir un user ami, si la relation n'exist pas no update,
si relation exit :
-si pas ami, no update,
-si meId a blocker userId, update la relation tq relation.relation === NONE
-si userId n'est pas blocker delete la relation 
fonction protege contre userId et meId invalide

## 3. block_user /block_user
Requete Post prenant un Body {userId : number} et un Authorization Bearer : token

Block un user, si relation n'existe pas, la creer avec is_block = 1, relation = NONE,
-si relation exist et relation = FRIEND, relation update isBlock = 1,
-si relation exist et isBlock = 1 , return 

## 4. unblock_user /unblock_user
Requete Post prenant un Body {userId : number} et un Authorization Bearer : token

Unblock un user, si relation n'existe pas, return;
si relation existe et relation = NONE, delete la relation
si relation existe et relation = FRIEND, relation update isBlock = 0,

## 5. list_friend : return User[]; /list_friend
Requete Get prenant un Authorization Bearer : token

Return un tableau des amis de @GetMe

## 6. list_block : return User[]; /list_block
Requete Get prenant un Authorization Bearer : token

Return un tableau des block user de @GetMe