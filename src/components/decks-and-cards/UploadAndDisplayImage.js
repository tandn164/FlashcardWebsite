import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { storage } from "../../firebase/firebaseIndex";
import { firebaseAuth } from "../../provider/AuthProvider";

const UploadAndDisplayImage = ({
    onSetImage,
    imageRef
}) => {
    const [image, setImage] = useState(null);
    const [filePath, setFilePath] = useState(imageRef);
    const { user } = useContext(firebaseAuth);
    const alert = useAlert()

    useEffect(() => {
        if (imageRef) {
            storage.ref(imageRef).getDownloadURL().then((downloadURL) => {
                setImage(downloadURL)
            });
            setFilePath(imageRef)
        }
    }, [imageRef]);

    return (
        <div style={{paddingBottom: 20}}>
            {filePath && (
                <div>
                    <img alt="not fount" width={"250px"} src={image} />
                    <br />
                    <button onClick={() => {
                        const deleteTask = storage.ref(filePath).delete();
                        deleteTask.then(() => {
                            alert.show('ファイルが正常に削除されました');
                            setFilePath(null)
                            onSetImage(null)
                        }).catch((error) => {
                        });
                    }}>削除する</button>
                </div>
            )}
            <br />

            <br />
            {filePath == null && 
            <input
            type="file"
            name="myImage"
            onChange={(event) => {
                
                const uploadTask = storage.ref(`${user.uid}/${event.target.files[0].name}`).put(event.target.files[0]);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                    },
                    () => {
                        storage.ref(`${user.uid}`).child(event.target.files[0].name).getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            alert.show("ファイルが正常にアップロードされました")
                            onSetImage(`${user.uid}/${event.target.files[0].name}`);
                            setImage(downloadURL)
                            setFilePath(`${user.uid}/${event.target.files[0].name}`)
                        });
                    }
                );
            }}
        />
            }
        </div>
    );
};

export default UploadAndDisplayImage;