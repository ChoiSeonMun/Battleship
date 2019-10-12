using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputManager : MonoBehaviour
{
    void Update()
    {
        if (Input.GetMouseButtonUp(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit2D hit = Physics2D.GetRayIntersection(ray, Mathf.Infinity);

            // 타일에는 콜라이더가 있지만 함선에는 없음
            if (hit.collider != null)
            {
                GameObject obj = hit.collider.gameObject;
                Hex hex = Hex.SqrToHex(obj.transform.position);
                Ship.EShip eShip = MapManager.instance.Ships[hex.y, hex.x];
                Debug.Log($"Clicked {hex}: {eShip}");

                switch (GameManager.instance.Mode)
                {
                    case GameManager.EMode.NONE:
                        break;
                    case GameManager.EMode.PLACE:
                        UIManager.instance.PlaceHighlight(hex);
                        if (eShip != Ship.EShip.NONE)
                        {
                            PlaceManager.instance.SelectShip(hex, eShip);
                        }
                        else  // eShip == NONE
                        {
                            PlaceManager.instance.DeselectShip();
                        }
                        break;
                    case GameManager.EMode.SELECT:
                        UIManager.instance.SelectHighlight(hex);
                        break;
                    case GameManager.EMode.ATTACK:
                        UIManager.instance.AttackHighlight(hex);
                        break;
                    default:
                        throw new System.ComponentModel.InvalidEnumArgumentException();
                }
            }
            else  // 타일이 없는 공간 클릭
            {
                UIManager.instance.UnhighlightAll();
            }
        }
    }
}
