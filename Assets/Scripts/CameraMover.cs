using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraMover : MonoBehaviour
{
    public static CameraMover instance;

     void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    public void Translate(Vector2 vec)
    {
        transform.Translate(vec);
    }
}
