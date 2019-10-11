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

                switch (GameManager.instance.Mode)
                {
                    case GameManager.EMode.NONE:
                        break;
                    case GameManager.EMode.SELECT:
                        UIManager.instance.SelectHighlight(hex);
                        break;
                    case GameManager.EMode.ATTACK:
                        UIManager.instance.AttackHighlight(hex);
                        break;
                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException($"※ Unhandled mode val: {GameManager.instance.Mode.ToString()}");
                }
            }
            else
            {

            }
        }
    }
}
