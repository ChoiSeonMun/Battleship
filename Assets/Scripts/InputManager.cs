using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputManager : MonoBehaviour
{
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit2D hit = Physics2D.GetRayIntersection(ray, Mathf.Infinity);

            if (hit.collider != null)
            {
                GameObject obj = hit.collider.gameObject;
                Hex hex = Hex.SqrToHex(obj.transform.position);
                Debug.Log(hex);
                UIManager.instance.Highlight(hex);
            }
            else
            {

            }
        }
    }
}
